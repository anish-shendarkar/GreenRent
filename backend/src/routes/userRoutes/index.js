import express from "express";
import profileRoutes from "./userProfileRoutes.js";
import listingRoutes from "./userListingRoutes.js";
import rentalRoutes from "./userRentalRoutes.js";
import reviewRoutes from "./userReviewRoutes.js";
import userChatRoutes from "./userChatRoutes.js";

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/listing", listingRoutes);
router.use("/rental", rentalRoutes);
router.use("/review", reviewRoutes);
router.use("/chat", userChatRoutes);

export default router;
