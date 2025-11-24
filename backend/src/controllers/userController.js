import { PrismaClient } from "@prisma/client";
import path from "path";
import redis from "../config/redis.js";

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
        const cached = await redis.get(`user:${req.user.id}:listings`);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const listings = await prisma.listing.findMany({
            where: { ownerId: req.user.id },
            include: { media: true },
        });
        await redis.setEx(`user:${req.user.id}:listings`, 600, JSON.stringify(listings));
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getListingById = async (req, res) => {
    try {
        const { listingId } = req.params;
        const cached = await redis.get(`listing:${listingId}`);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const listing = await prisma.listing.findUnique({
            where: { id: Number(listingId) },
            include: { media: true },
        });
        if (!listing) return res.status(404).json({ message: "Listing not found" });
        if (!listing.available && listing.availableFrom <= new Date()) {
            await prisma.listing.update({
                where: { id: Number(listingId) },
                data: { available: true, availableFrom: new Date() },
            });
        }
        await redis.setEx(`listing:${listingId}`, 600, JSON.stringify(listing));

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
        const { listingId } = req.params;
        const { rentalDays } = req.body;

        const listing = await prisma.listing.findUnique({ where: { id: Number(listingId) } });
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        if (!listing.available) return res.status(400).json({ message: `Item not available until ${listing.availableFrom}` });

        const now = new Date();
        const rentalEndDate = new Date(now);
        rentalEndDate.setDate(now.getDate() + rentalDays);

        const rental = await prisma.rental.create({
            data: {
                listingId: Number(listingId),
                renterId: req.user.id,
                startDate: now,
                endDate: rentalEndDate,
                totalPrice: listing.pricePerDay * rentalDays,
            },
        });

        await prisma.listing.update({
            where: { id: Number(listingId) },
            data: { available: false, availableFrom: rentalEndDate },
        });

        res.status(201).json({ message: "Rental successful", rental });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserRentals = async (req, res) => {
    try {
        const cached = await redis.get(`user:${req.user.id}:rentals`);
        if (cached) {
            return res.json(JSON.parse(cached));
        }
        const rentals = await prisma.rental.findMany({
            where: { renterId: req.user.id },
            include: { listing: true },
        });
        await redis.set(`user:${req.user.id}:rentals`, JSON.stringify(rentals));
        res.json(rentals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const acceptRentalRequest = async (req, res) => {
    try {
        const { rentalId } = req.params;
        const rental = await prisma.rental.findUnique({
            where: {
                id: Number(rentalId),
                status: "PENDING"
            },
            include: { listing: true }
        });
        if (!rental) return res.status(404).json({ message: "Rental request not found" });

        if (rental.listing.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to accept this rental request" });
        }

        await prisma.$transaction(async (tx) => {
            await tx.rental.update({
                where: { id: rental.id },
                data: { status: "CONFIRMED" },
            });

            await tx.listing.update({
                where: { id: rental.listingId },
                data: { available: false },
            });
        });
        res.json({ message: "Rental request accepted", rental });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const declineRentalRequest = async (req, res) => {
    try {
        const { rentalId } = req.params;
        const rental = await prisma.rental.findUnique({
            where: {
                id: Number(rentalId),
                status: "PENDING"
            },
            include: { listing: true }
        });
        if (!rental) return res.status(404).json({ message: "Rental request not found" });
        if (rental.listing.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to decline this rental request" });
        }
        await prisma.rental.update({
            where: { id: rental.id },
            data: { status: "DECLINED" },
        });
        res.json({ message: "Rental request declined" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const postListingReview = async (req, res) => {
    try {
        const listingId = Number(req.params.listingId);
        const { rating, comment } = req.body;

        const listing = await prisma.listing.findUnique({
            where: { id: listingId },
        });
        if (!listing) return res.status(404).json({ message: "Listing not found" });

        const hasUsedProduct = await prisma.rental.findFirst({
            where: {
                listingId: listingId,
                renterId: req.user.id,
                status: "CONFIRMED",
            },
        });

        if (!hasUsedProduct) {
            return res.status(400).json({ message: "You can only review listings you have rented" });
        }

        const review = await prisma.review.create({
            data: {
                listingId: listingId,
                reviewerId: req.user.id,
                rating: Number(rating),
                comment,
            },
        });
        res.status(201).json({ message: "Review posted successfully", review });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const reviewId = Number(req.params.reviewId);
        const review = await prisma.review.findUnique({ where: { id: reviewId } });

        if (!review) return res.status(404).json({ message: "Review not found" });
        if (review.reviewerId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this review" });
        }

        await prisma.review.delete({ where: { id: reviewId } });
        res.status(204).json({ message: "Review deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserReviewsForListing = async (req, res) => {
    const listingId = Number(req.params.listingId);
    try {
        const reviews = await prisma.review.findMany({
            where: { listingId: listingId },
        });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
