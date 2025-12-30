import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./prisma.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error("Unauthorized"));

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = payload;
            next();
        } catch {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.user.id);

        socket.on("join-chat", (chatId) => {
            socket.join(`chat-${chatId}`);
        });

        // socket.on("send-message", async ({ chatId, senderId, content }) => {
        //     const message = await prisma.message.create({
        //         data: {
        //             chatId: Number(chatId),
        //             senderId: socket.user.id,
        //             content,
        //         },
        //     });

        //     io.to(`chat-${chatId}`).emit("new-message", message);
        // });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.user.id);
        });
    });
    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}
