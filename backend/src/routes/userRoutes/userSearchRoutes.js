import express from "express";
import { searchListings } from "../../controllers/userController.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, searchListings);

export default router;
