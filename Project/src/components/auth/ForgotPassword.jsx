import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiShieldCheck } from 'react-icons/hi';
import AuthLayout from './AuthLayout';

const steps = ['Enter Email', 'Verify OTP', 'New Password'];

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const inputRefs = [];

    const delay = (d) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

    const inputClass =
        'w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300';

    // Step 1: Send reset OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message);
                return;
            }
            setStep(1);
        } catch {
            setError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp.every((d) => d !== '')) return;
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-reset-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.join('') }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message);
                return;
            }
            setStep(2);
        } catch {
            setError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            setError('Password must include uppercase, lowercase, number and special character.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });
            const data = await res.json();
            if (!data.success) {
                setError(data.message);
                return;
            }
            setSuccess('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2500);
        } catch {
            setError('Unable to connect to server.');
        } finally {
            setLoading(false);
        }
    };

    // OTP input handlers
    const handleOTPChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs[index + 1]?.focus();
        }
    };

    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1]?.focus();
        }
    };

    const handleOTPPaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        data.split('').forEach((ch, i) => { newOtp[i] = ch; });
        setOtp(newOtp);
    };

    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '•'.repeat(b.length) + c)
        : '';

    // Password strength
    const getStrength = (pwd) => {
        if (!pwd) return { level: 0, label: '', color: '' };
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[a-z]/.test(pwd)) s++;
        if (/\d/.test(pwd)) s++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) s++;
        if (s <= 2) return { level: s, label: 'Weak', color: 'bg-red-400' };
        if (s <= 3) return { level: s, label: 'Fair', color: 'bg-yellow-400' };
        if (s <= 4) return { level: s, label: 'Good', color: 'bg-blue-400' };
        return { level: s, label: 'Strong', color: 'bg-emerald-400' };
    };
    const pwdStr = getStrength(newPassword);

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <motion.div {...delay(0.1)} className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
                        {step === 2 ? <HiLockClosed className="w-8 h-8 text-white" /> :
                            step === 1 ? <HiShieldCheck className="w-8 h-8 text-white" /> :
                                <HiMail className="w-8 h-8 text-white" />}
                    </div>
                </motion.div>

                <motion.h1 {...delay(0.2)} className="text-2xl font-bold text-white mb-2">
                    {step === 0 && 'Forgot Password'}
                    {step === 1 && 'Verify OTP'}
                    {step === 2 && 'Set New Password'}
                </motion.h1>
                <motion.p {...delay(0.3)} className="text-white/40 text-sm">
                    {step === 0 && 'Enter your email to receive a reset code'}
                    {step === 1 && <>Enter the 6-digit code sent to<br /><span className="text-white/60 font-medium">{maskedEmail}</span></>}
                    {step === 2 && 'Create a strong new password'}
                </motion.p>
            </div>

            {/* Progress */}
            <motion.div {...delay(0.15)} className="flex justify-center gap-2 mb-6">
                {steps.map((s, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'w-8 bg-amber-400' : 'w-2 bg-white/10'}`} />
                ))}
            </motion.div>

            {/* Messages */}
            {error && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-400/30 text-red-300 text-sm text-center">
                    {error}
                </motion.div>
            )}
            {success && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm text-center">
                    {success}
                </motion.div>
            )}

            {/* Step 1: Email */}
            {step === 0 && (
                <form onSubmit={handleSendOTP} className="space-y-5">
                    <motion.div {...delay(0.35)} className="relative">
                        <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                        <input type="email" placeholder="Email address" value={email}
                            onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                    </motion.div>
                    <motion.button {...delay(0.4)} type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>Sending...
                            </span>
                        ) : 'Send Reset Code'}
                    </motion.button>
                </form>
            )}

            {/* Step 2: OTP */}
            {step === 1 && (
                <form onSubmit={handleVerifyOTP}>
                    <motion.div {...delay(0.35)} className="flex justify-center gap-3 mb-6">
                        {otp.map((digit, i) => (
                            <input key={i} ref={(el) => (inputRefs[i] = el)} type="text" inputMode="numeric" maxLength={1}
                                value={digit} onChange={(e) => handleOTPChange(i, e.target.value)}
                                onKeyDown={(e) => handleOTPKeyDown(i, e)} onPaste={i === 0 ? handleOTPPaste : undefined}
                                className={`w-12 h-14 rounded-xl text-center text-xl font-bold transition-all duration-300 focus:outline-none
                                    ${digit ? 'bg-amber-500/20 border-amber-400/50 text-white ring-2 ring-amber-400/20' : 'bg-white/5 border-white/10 text-white/80'}
                                    border focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/25`}
                            />
                        ))}
                    </motion.div>
                    <motion.button {...delay(0.4)} type="submit" disabled={!otp.every(d => d !== '') || loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>Verifying...
                            </span>
                        ) : 'Verify OTP'}
                    </motion.button>
                </form>
            )}

            {/* Step 3: New Password */}
            {step === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <motion.div {...delay(0.35)} className="space-y-2">
                        <div className="relative">
                            <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                            <input type={showPass ? 'text' : 'password'} placeholder="New Password"
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                className={`${inputClass} pr-11`} required />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                                {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                            </button>
                        </div>
                        {newPassword && (
                            <div className="flex items-center gap-2 px-1">
                                <div className="flex-1 flex gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwdStr.level ? pwdStr.color : 'bg-white/10'}`} />
                                    ))}
                                </div>
                                <span className={`text-[11px] font-medium ${pwdStr.level <= 2 ? 'text-red-400' : pwdStr.level <= 3 ? 'text-yellow-400' : pwdStr.level <= 4 ? 'text-blue-400' : 'text-emerald-400'}`}>
                                    {pwdStr.label}
                                </span>
                            </div>
                        )}
                    </motion.div>
                    <motion.div {...delay(0.4)} className="relative">
                        <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                        <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm New Password"
                            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`${inputClass} pr-11`} required />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                            {showConfirm ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                    </motion.div>
                    <motion.button {...delay(0.45)} type="submit" disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>Resetting...
                            </span>
                        ) : 'Reset Password'}
                    </motion.button>
                </form>
            )}

            {/* Back to login */}
            <motion.p {...delay(0.5)} className="text-center mt-6 text-sm text-white/40">
                Remember your password?{' '}
                <Link to="/login" className="text-amber-300 hover:text-amber-200 font-semibold transition-colors">
                    Sign In
                </Link>
            </motion.p>
        </AuthLayout>
    );
}
