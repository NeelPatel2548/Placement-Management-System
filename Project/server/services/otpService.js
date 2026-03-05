// ─── OTP Service ───
// Handles OTP generation and attempt tracking

// Generate 6-digit OTP
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// OTP expiry durations
export const OTP_EXPIRY = {
    REGISTRATION: 10 * 60 * 1000, // 10 minutes
    LOGIN: 5 * 60 * 1000,         // 5 minutes
    RESEND: 10 * 60 * 1000,       // 10 minutes
};

// Max OTP attempts before lockout
export const MAX_OTP_ATTEMPTS = 5;

// Validate OTP against user record
export function validateOTP(user, otp) {
    if (!user.otp) {
        return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
        return { valid: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    if (new Date() > user.otpExpiry) {
        return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    if (user.otp !== otp) {
        return { valid: false, message: 'Invalid OTP. Please try again.', incrementAttempt: true };
    }

    return { valid: true };
}

// Clear OTP fields from user
export function clearOTPFields(user) {
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
}
