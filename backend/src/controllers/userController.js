import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
