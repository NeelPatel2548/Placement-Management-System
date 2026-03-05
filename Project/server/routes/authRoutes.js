import express from 'express';
import { register, verifyOTP, resendOTP, login, loginVerify } from '../controllers/authController.js';

const router = express.Router();

// Registration
router.post('/register', register);

// Email verification
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

// Login (two-step)
router.post('/login', login);
router.post('/login/verify', loginVerify);

export default router;
