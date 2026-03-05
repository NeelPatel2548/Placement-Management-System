import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateOTP, validateOTP, clearOTPFields, OTP_EXPIRY, MAX_OTP_ATTEMPTS } from '../services/otpService.js';
import { sendOTPEmail } from '../services/emailService.js';

// ─── Password validation regex ───
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

// ═══════════════════════════════════════
// POST /api/auth/register
// ═══════════════════════════════════════
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (name, email, password, role)',
            });
        }

        // Validate role
        if (!['student', 'company'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role must be either student or company',
            });
        }

        // Validate password strength
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must contain uppercase, lowercase, number and special character.',
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already exists. Please login instead.',
            });
        }

        // Hash password (saltRounds = 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY.REGISTRATION);

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            isVerified: false,
            otp,
            otpExpiry,
            otpAttempts: 0,
        });

        // Send OTP email
        await sendOTPEmail(email, name, otp, 'verify');

        console.log(`📧 OTP sent to ${email}: ${otp}`);

        res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your email.',
            email: user.email,
        });
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
        });
    }
};

// ═══════════════════════════════════════
// POST /api/auth/verify-otp
// ═══════════════════════════════════════
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified',
            });
        }

        // Validate OTP
        const result = validateOTP(user, otp);
        if (!result.valid) {
            if (result.incrementAttempt) {
                user.otpAttempts = (user.otpAttempts || 0) + 1;
                await user.save();
            }
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        // Mark as verified, clear OTP
        user.isVerified = true;
        clearOTPFields(user);
        await user.save();

        // Generate JWT (24h expiry)
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`✅ OTP verified for ${email}`);

        res.json({
            success: true,
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('❌ OTP verification error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP verification',
        });
    }
};

// ═══════════════════════════════════════
// POST /api/auth/resend-otp
// ═══════════════════════════════════════
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Generate new OTP and reset attempts
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY.RESEND);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        user.otpAttempts = 0;
        await user.save();

        // Send OTP email
        await sendOTPEmail(email, user.name, otp, 'verify');

        console.log(`📧 OTP resent to ${email}: ${otp}`);

        res.json({
            success: true,
            message: 'OTP resent successfully',
        });
    } catch (error) {
        console.error('❌ Resend OTP error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while resending OTP',
        });
    }
};

// ═══════════════════════════════════════
// POST /api/auth/login  (Step 1: validate credentials, send OTP)
// ═══════════════════════════════════════
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in',
                needsVerification: true,
                email: user.email,
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate OTP for login verification
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY.LOGIN);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        user.otpAttempts = 0;
        await user.save();

        // Send OTP via email
        await sendOTPEmail(email, user.name, otp, 'login');

        console.log(`📧 Login OTP sent to ${email}: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent to your email for login verification.',
            requiresOTP: true,
            email: user.email,
        });
    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
        });
    }
};

// ═══════════════════════════════════════
// POST /api/auth/login/verify  (Step 2: verify login OTP, return JWT)
// ═══════════════════════════════════════
export const loginVerify = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Validate OTP
        const result = validateOTP(user, otp);
        if (!result.valid) {
            if (result.incrementAttempt) {
                user.otpAttempts = (user.otpAttempts || 0) + 1;
                await user.save();
            }
            return res.status(400).json({
                success: false,
                message: result.message,
            });
        }

        // Clear OTP fields
        clearOTPFields(user);
        await user.save();

        // Generate JWT (24h expiry)
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`✅ User logged in: ${email}`);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('❌ Login verify error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during login verification',
        });
    }
};
