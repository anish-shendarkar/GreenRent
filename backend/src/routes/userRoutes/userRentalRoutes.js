import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { getUserRentals, rentListing, acceptRentalRequest } from '../../controllers/userController.js';

const router = express.Router();

router.get('/getrentals', authMiddleware, getUserRentals);
router.post('/rent/:listingId', authMiddleware, rentListing);
router.post('/accept/:rentalId', authMiddleware, acceptRentalRequest);

export default router;