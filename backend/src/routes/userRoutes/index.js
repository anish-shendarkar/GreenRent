import express from "express";
import profileRoutes from "./userProfileRoutes.js";
import listingRoutes from "./userListingRoutes.js";
import rentalRoutes from "./userRentalRoutes.js";

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/listing", listingRoutes);
router.use("/rental", rentalRoutes);

export default router;
