import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { getUserListings, uploadListingMedia, createListing, deleteListing, getListingById } from '../../controllers/userController.js';
import { upload } from '../../middlewares/upload.js';

const router = express.Router();

router.get('/listings', authMiddleware, getUserListings);
router.get('/:listingId', authMiddleware, getListingById);
router.delete('/listings/:listingId', authMiddleware, deleteListing);
router.post('/listings', authMiddleware, createListing);
router.post('/listings/:listingId/media', authMiddleware, upload.array('media', 5), uploadListingMedia);

export default router;
