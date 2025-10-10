import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { getUserProfile, updateUserAddress, updateUserName, updateUserPhone } from '../../controllers/userController.js';

const router = express.Router();

router.get('/', authMiddleware, getUserProfile);
router.patch('/name', authMiddleware, updateUserName);
router.patch('/address', authMiddleware, updateUserAddress);
router.patch('/phone', authMiddleware, updateUserPhone);

export default router;
