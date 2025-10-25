import express from 'express';
import { signin, signup, updateUser, verifyOtp } from '../controllers/userControllers.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtp);
router.post('/signin', signin);
router.put('/update/:userId', protect, updateUser);

export default router;