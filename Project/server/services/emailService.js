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

// ─── Shared email wrapper ───
function getTransporter() {
  if (!transporter) {
    throw new Error('Email transporter not initialized. Call initEmailService() first.');
  }
  return transporter;
}

// ─── PMS email header HTML ───
const emailHeader = `
    <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); line-height: 48px; color: white; font-weight: bold; font-size: 20px;">P</div>
        <h2 style="color: white; margin: 12px 0 0;">PMS</h2>
        <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">Placement Management System</p>
    </div>`;

const emailWrapper = (content) => `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); border-radius: 16px;">
        ${emailHeader}
        ${content}
    </div>`;

// ─── Send OTP Email ───
export async function sendOTPEmail(email, name, code, purpose = 'verify') {
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

  const html = emailWrapper(`
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
    `);

  await getTransporter().sendMail({
    from: `"PMS - Placement Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjectMap[purpose] || subjectMap.verify,
    html,
  });
}

// ─── Send Password Reset OTP Email ───
export async function sendPasswordResetOTPEmail(email, name, code) {
  const html = emailWrapper(`
        <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; text-align: center;">
            <h3 style="color: white; margin: 0 0 8px;">Hello${name ? ` ${name}` : ''},</h3>
            <p style="color: rgba(255,255,255,0.6); margin: 0 0 8px; font-size: 14px;">We received a request to reset your password for your Placement Management System account.</p>
            <p style="color: rgba(255,255,255,0.6); margin: 0 0 24px; font-size: 14px;">Your OTP for password reset is:</p>
            <div style="background: rgba(239,68,68,0.2); border: 1px solid rgba(239,68,68,0.4); border-radius: 12px; padding: 16px; margin: 0 0 24px;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: white;">${code}</span>
            </div>
            <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0;">This OTP will expire in <strong style="color: rgba(255,255,255,0.7);">10 minutes</strong>.</p>
        </div>
        <p style="color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; margin-top: 24px;">
            If you did not request a password reset, please ignore this email.
        </p>
    `);

  await getTransporter().sendMail({
    from: `"PMS - Placement Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html,
  });
}

// ─── Send Password Changed Confirmation Email ───
export async function sendPasswordChangedEmail(email, name, scenario = 'reset') {
  const subjectMap = {
    reset: 'Your Password Has Been Changed',
    change: 'Your Password Has Been Updated',
  };

  const messageMap = {
    reset: 'Your password for the Placement Management System has been successfully changed.',
    change: 'Your account password has been successfully updated.',
  };

  const warningMap = {
    reset: 'If you did NOT change your password, please contact the administrator immediately and secure your account.',
    change: 'If you did not make this change, please reset your password immediately or contact the administrator.',
  };

  const html = emailWrapper(`
        <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 32px; text-align: center;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #14b8a6); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <span style="font-size: 24px;">✓</span>
            </div>
            <h3 style="color: white; margin: 0 0 8px;">Hello${name ? ` ${name}` : ''},</h3>
            <p style="color: rgba(255,255,255,0.6); margin: 0 0 16px; font-size: 14px;">${messageMap[scenario]}</p>
            <p style="color: rgba(255,255,255,0.5); margin: 0 0 16px; font-size: 13px;">${warningMap[scenario]}</p>
            <div style="background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3); border-radius: 10px; padding: 12px; margin-top: 16px;">
                <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0;">🔒 <strong style="color: rgba(255,255,255,0.7);">Security Tip:</strong> Always use a strong password and do not share it with others.</p>
            </div>
        </div>
        <p style="color: rgba(255,255,255,0.3); font-size: 11px; text-align: center; margin-top: 24px;">
            — Placement Management System Security Team
        </p>
    `);

  await getTransporter().sendMail({
    from: `"PMS - Placement Management" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subjectMap[scenario],
    html,
  });
}

export default transporter;
