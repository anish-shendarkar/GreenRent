import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { postListingReview, deleteReview, getUserReviewsForListing } from '../../controllers/userController.js';

const router = express.Router();

router.post('/post/:listingId', authMiddleware, postListingReview);
router.delete('/delete/:reviewId', authMiddleware, deleteReview);
router.get('/:listingId', authMiddleware, getUserReviewsForListing);

export default router;
