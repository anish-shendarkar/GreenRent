import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

// Profile Management Controllers

export const getUserProfile = async (req, res) => {
    try {
        const profile = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { name: true, email: true, address: true, phone: true, createdAt: true },
        });
        if (!profile) return res.status(404).json({ message: "User not found" });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const updateUserName = async (req, res) => {
    try {
        const { name } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { name },
        });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUserAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { address },
        });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUserPhone = async (req, res) => {
    try {
        const { phone } = req.body;
        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: { phone },
        });
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Listing Management Controllers

export const getUserListings = async (req, res) => {
    try {
        const listings = await prisma.listing.findMany({
            where: { userId: req.user.id },
            include: { media: true },
        });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getListingById = async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
            include: { media: true },
        });
        if (!listing) return res.status(404).json({ message: "Listing not found" });
        if (!listing.available && listing.availableFrom <= new Date()) {
            await prisma.listing.update({
                where: { id: listingId },
                data: { available: true, availableFrom: new Date() },
            });
        }
        res.json(listing);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createListing = async (req, res) => {
    try {
        const { name, description, pricePerDay, advancePayment, categories = [] } = req.body;
        if (!name || !description || !pricePerDay || !advancePayment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const validCategories = [
            'ELECTRONICS', 'TOOLS', 'SPORTS', 'OUTDOORS',
            'CLOTHING', 'BOOKS', 'MUSIC', 'GAMES', 'TOYS',
        ];

        for (const cat of categories) {
            if (!validCategories.includes(cat)) {
                return res.status(400).json({ error: `Invalid category: ${cat}` });
            }
        }

        const newListing = await prisma.listing.create({
            data: {
                name,
                description,
                pricePerDay: parseFloat(pricePerDay),
                advancePayment: parseFloat(advancePayment),
                ownerId: req.user.id,
                categories: {
                    create: categories.map(cat => ({ category: cat })),
                },
            },
            include: { categories: true },
        });
        res.status(201).json({
            message: "Listing created successfully",
            listing: newListing
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const uploadListingMedia = async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });

        if (!listing) return res.status(404).json({ error: 'Listing not found' });

        // Process uploaded files
        const mediaFiles = req.files.map((file) => {
            const ext = path.extname(file.originalname).toLowerCase();

            let type;
            if (['.jpg', '.jpeg', '.png'].includes(ext)) type = 'IMAGE';
            else if (['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) type = 'VIDEO';
            else type = 'DOCUMENT';

            return {
                listingId: Number(listingId),
                url: file.path.replace(/\\/g, '/'), // normalize for Windows
                type,
            };
        });

        // Store media details in DB
        const savedMedia = await prisma.media.createMany({
            data: mediaFiles,
        });

        res.status(201).json({ message: 'Media uploaded successfully', media: savedMedia });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        await prisma.listing.delete({
            where: { id: listingId },
            ownerId: req.user.id,
        });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Rental Management Controllers

export const rentListing = async (req, res) => {
    try {
        const { listingId, rentalDays } = req.body;

        const listing = await prisma.listing.findUnique({ where: { id: listingId } });
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        if (!listing.available) return res.status(400).json({ message: `Item not available until ${listing.availableFrom}` });

        const now = new Date();
        const rentalEndDate = new Date(now);
        rentalEndDate.setDate(now.getDate() + rentalDays);

        const rental = await prisma.rental.create({
            data: {
                listingId: listingId,
                renterId: req.user.id,
                startDate: now,
                endDate: rentalEndDate,
                totalPrice: listing.pricePerDay * rentalDays,
            },
        });

        await prisma.listing.update({
            where: { id: listingId },
            data: { available: false, availableFrom: rentalEndDate },
        });

        res.status(201).json({ message: "Rental successful", rental });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserRentals = async (req, res) => {
    try {
        const rentals = await prisma.rental.findMany({
            where: { renterId: req.user.id },
            include: { listing: true },
        });
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
