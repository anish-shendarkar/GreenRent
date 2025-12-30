import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import {
  getOrCreateChat,
  getMessages,
  sendMessage,
  getUserChats,
} from "../../controllers/userController.js";

const router = express.Router();

router.post("/new/:listingId", authMiddleware, getOrCreateChat);
router.get("/:chatId/messages", authMiddleware, getMessages);
router.post("/:chatId/message", authMiddleware, sendMessage);
router.get("/allchats", authMiddleware, getUserChats);

export default router;