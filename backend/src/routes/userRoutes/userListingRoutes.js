import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { getUserListings, uploadListingMedia } from '../../controllers/userController.js';
import { createListing } from '../../controllers/userController.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

router.get('/listings', authMiddleware, getUserListings);
router.post('/listings', authMiddleware, createListing);
router.post('/listings/:listingId/media', authMiddleware, upload.array('media', 5), uploadListingMedia);

export default router;
