import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
        },
        role: {
            type: String,
            enum: ['student', 'company', 'admin'],
            required: [true, 'Role is required'],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        // Auth OTP fields (registration + login)
        otp: {
            type: String,
        },
        otpExpiry: {
            type: Date,
        },
        otpAttempts: {
            type: Number,
            default: 0,
        },
        // Password reset OTP fields
        resetOtp: {
            type: String,
        },
        resetOtpExpiry: {
            type: Date,
        },
        otpVerifiedForReset: {
            type: Boolean,
            default: false,
        },
        profileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
