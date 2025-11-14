import express from "express";
import profileRoutes from "./userProfileRoutes.js";
import listingRoutes from "./userListingRoutes.js";

const router = express.Router();

router.use("/profile", profileRoutes);
router.use("/listing", listingRoutes);

export default router;
