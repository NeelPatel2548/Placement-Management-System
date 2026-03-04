import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── In-memory OTP store (use Redis/DB in production) ───
const otpStore = new Map(); // email → { code, expiresAt }

// ─── Nodemailer transporter ───
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify transporter on startup
transporter.verify()
    .then(() => console.log('✅ Email transporter ready'))
    .catch((err) => console.error('❌ Email transporter error:', err.message));

// ─── Generate 6-digit OTP ───
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Route: Send OTP ───
app.post('/api/send-otp', async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const code = generateOTP();
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

    // Store OTP
    otpStore.set(email, { code, expiresAt });

    // Auto-cleanup after expiry
    setTimeout(() => otpStore.delete(email), 2 * 60 * 1000);

    try {
        await transporter.sendMail({
            from: `"PMS - Placement Management" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your PMS Verification Code',
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); line-height: 48px; color: white; font-weight: bold; font-size: 20px;">P</div>
            <h2 style="color: white; margin: 12px 0 0;">PMS</h2>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">Placement Management System</p>
          </div>
          <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; text-align: center;">
            <h3 style="color: white; margin: 0 0 8px;">Hello${name ? ` ${name}` : ''},</h3>
            <p style="color: rgba(255,255,255,0.6); margin: 0 0 24px; font-size: 14px;">Use the code below to verify your email address.</p>
            <div style="background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); border-radius: 12px; padding: 16px; margin: 0 0 24px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: white;">${code}</span>
            </div>
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">This code expires in <strong style="color: rgba(255,255,255,0.7);">2 minutes</strong>.</p>
          </div>
          <p style="color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; margin-top: 24px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
        });

        console.log(`📧 OTP sent to ${email}: ${code}`);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
        console.error('❌ Failed to send OTP:', err.message);
        res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }
});

// ─── Route: Verify OTP ───
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    const stored = otpStore.get(email);

    if (!stored) {
        return res.status(400).json({ success: false, message: 'No OTP found. Please request a new one.' });
    }

    if (Date.now() > stored.expiresAt) {
        otpStore.delete(email);
        return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (stored.code !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }

    // OTP verified
    otpStore.delete(email);
    console.log(`✅ OTP verified for ${email}`);
    res.json({ success: true, message: 'Email verified successfully' });
});

// ─── Start server ───
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 PMS Backend running on http://localhost:${PORT}`);
});
