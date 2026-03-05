import nodemailer from 'nodemailer';

let transporter = null;

// ─── Initialize transporter (call after dotenv.config()) ───
export function initEmailService() {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    transporter.verify()
        .then(() => console.log('✅ Email transporter ready'))
        .catch((err) => console.error('❌ Email transporter error:', err.message));
}

// ─── Send OTP Email ───
export async function sendOTPEmail(email, name, code, purpose = 'verify') {
    if (!transporter) {
        throw new Error('Email transporter not initialized. Call initEmailService() first.');
    }

    const subjectMap = {
        verify: 'Your PMS Verification Code',
        login: 'Your PMS Login Verification Code',
    };

    const purposeTextMap = {
        verify: 'Use the code below to verify your email address.',
        login: 'Use the code below to complete your login.',
    };

    const expiryTextMap = {
        verify: '10 minutes',
        login: '5 minutes',
    };

    await transporter.sendMail({
        from: `"PMS - Placement Management" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: subjectMap[purpose] || subjectMap.verify,
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); line-height: 48px; color: white; font-weight: bold; font-size: 20px;">P</div>
            <h2 style="color: white; margin: 12px 0 0;">PMS</h2>
            <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">Placement Management System</p>
          </div>
          <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; text-align: center;">
            <h3 style="color: white; margin: 0 0 8px;">Hello${name ? ` ${name}` : ''},</h3>
            <p style="color: rgba(255,255,255,0.6); margin: 0 0 24px; font-size: 14px;">${purposeTextMap[purpose] || purposeTextMap.verify}</p>
            <div style="background: rgba(99,102,241,0.2); border: 1px solid rgba(99,102,241,0.4); border-radius: 12px; padding: 16px; margin: 0 0 24px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: white;">${code}</span>
            </div>
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">This code expires in <strong style="color: rgba(255,255,255,0.7);">${expiryTextMap[purpose] || expiryTextMap.verify}</strong>.</p>
          </div>
          <p style="color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; margin-top: 24px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
    });
}

export default transporter;
