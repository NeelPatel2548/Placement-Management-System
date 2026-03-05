import express from 'express';
import {
    register,
    verifyOTP,
    resendOTP,
    login,
    loginVerify,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration
router.post('/register', register);

// Email verification
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Login (two-step)
router.post('/login', login);
router.post('/login/verify', loginVerify);

// Forgot password (3-step)
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

// Change password (authenticated)
router.put('/change-password', protect, changePassword);

export default router;
