import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Notification from '../models/Notification.js';
import { generateOTP, validateOTP, clearOTPFields, OTP_EXPIRY, MAX_OTP_ATTEMPTS } from '../services/otpService.js';
import { sendOTPEmail, sendPasswordResetOTPEmail, sendPasswordChangedEmail } from '../services/emailService.js';

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
        if (!['student', 'company', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role must be student, company, or admin',
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

        // If registering as student, create a Student document
        if (role === 'student') {
            await Student.create({ userId: user._id });
        }

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

// ═══════════════════════════════════════
// POST /api/auth/forgot-password  (Step 1: send reset OTP)
// ═══════════════════════════════════════
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required',
            });
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No account found with this email',
            });
        }

        // Generate OTP for password reset
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY.REGISTRATION); // 10 min

        user.resetOtp = otp;
        user.resetOtpExpiry = otpExpiry;
        user.otpVerifiedForReset = false;
        await user.save();

        // Send password reset email
        await sendPasswordResetOTPEmail(email, user.name, otp);

        console.log(`📧 Password reset OTP sent to ${email}: ${otp}`);

        res.json({
            success: true,
            message: 'Password reset OTP sent to your email.',
            email: user.email,
        });
    } catch (error) {
        console.error('❌ Forgot password error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset request',
        });
    }
};

// ═══════════════════════════════════════
// POST /api/auth/verify-reset-otp  (Step 2: verify reset OTP)
// ═══════════════════════════════════════
export const verifyResetOTP = async (req, res) => {
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

        // Check reset OTP
        if (!user.resetOtp) {
            return res.status(400).json({
                success: false,
                message: 'No reset OTP found. Please request a new one.',
            });
        }

        if (new Date() > user.resetOtpExpiry) {
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.',
            });
        }

        if (user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP. Please try again.',
            });
        }

        // Mark OTP as verified for reset
        user.otpVerifiedForReset = true;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();

        console.log(`✅ Reset OTP verified for ${email}`);

        res.json({
            success: true,
            message: 'OTP verified. You can now reset your password.',
        });
    } catch (error) {
        console.error('❌ Verify reset OTP error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during OTP verification',
        });
    }
};

// ═══════════════════════════════════════
// POST /api/auth/reset-password  (Step 3: set new password)
// ═══════════════════════════════════════
export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Email and new password are required',
            });
        }

        // Validate password strength
        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must include uppercase, lowercase, number and special character.',
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

        // Ensure OTP was verified
        if (!user.otpVerifiedForReset) {
            return res.status(400).json({
                success: false,
                message: 'Please verify OTP before resetting password.',
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otpVerifiedForReset = false;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();

        // Send confirmation email
        await sendPasswordChangedEmail(email, user.name, 'reset');

        // Create security notification
        await Notification.create({
            userId: user._id,
            title: 'Password Changed',
            message: 'Your account password was successfully updated.',
            type: 'security',
        });

        console.log(`🔐 Password reset for ${email}`);

        res.json({
            success: true,
            message: 'Password has been reset successfully. Please login with your new password.',
        });
    } catch (error) {
        console.error('❌ Reset password error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset',
        });
    }
};

// ═══════════════════════════════════════
// PUT /api/auth/change-password  (logged-in user)
// ═══════════════════════════════════════
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required',
            });
        }

        // Validate new password strength
        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must include uppercase, lowercase, number and special character.',
            });
        }

        // Fetch user with password
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Hash and update new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Send confirmation email
        await sendPasswordChangedEmail(user.email, user.name, 'change');

        // Create security notification
        await Notification.create({
            userId: user._id,
            title: 'Password Changed',
            message: 'Your account password was successfully updated.',
            type: 'security',
        });

        console.log(`🔐 Password changed for ${user.email}`);

        res.json({
            success: true,
            message: 'Password changed successfully.',
        });
    } catch (error) {
        console.error('❌ Change password error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error during password change',
        });
    }
};
