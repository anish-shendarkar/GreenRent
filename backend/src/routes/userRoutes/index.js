import express from "express";
import profileRoutes from "./userProfileRoutes.js";

const router = express.Router();

router.use("/profile", profileRoutes);

export default router;
