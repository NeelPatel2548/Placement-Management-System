import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import AuthLayout from './AuthLayout';

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    const email = localStorage.getItem('pms_verify_email') || '';
    const name = localStorage.getItem('pms_verify_name') || '';

    // Redirect if no email in storage
    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timer <= 0) {
            setCanResend(true);
            return;
        }
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        data.split('').forEach((ch, i) => { newOtp[i] = ch; });
        setOtp(newOtp);
        const focusIdx = Math.min(data.length, 5);
        inputRefs.current[focusIdx]?.focus();
    };

    const handleResend = async () => {
        setResending(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/resend-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            setTimer(120);
            setCanResend(false);
            setOtp(Array(6).fill(''));
            inputRefs.current[0]?.focus();
        } catch (err) {
            setError('Unable to resend OTP. Please try again.');
        } finally {
            setResending(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!otp.every((d) => d !== '')) return;

        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otp.join('') }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            // Store auth token and user info
            localStorage.setItem('pms_token', data.token);
            localStorage.setItem('pms_user', JSON.stringify(data.user));

            // Clean up verification data
            localStorage.removeItem('pms_verify_email');
            localStorage.removeItem('pms_verify_name');

            navigate('/verify-success');
        } catch (err) {
            setError('Unable to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const delay = (d) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

    // Mask email for display
    const maskedEmail = email
        ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '•'.repeat(b.length) + c)
        : '';

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                {/* Email icon */}
                <motion.div {...delay(0.1)} className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-xl shadow-primary-500/30">
                        <HiMail className="w-8 h-8 text-white" />
                    </div>
                </motion.div>

                <motion.h1 {...delay(0.2)} className="text-2xl font-bold text-white mb-2">
                    Verify Your Email
                </motion.h1>
                <motion.p {...delay(0.3)} className="text-white/40 text-sm leading-relaxed">
                    We've sent a 6-digit verification code to
                    <br />
                    <span className="text-white/60 font-medium">{maskedEmail}</span>
                </motion.p>
            </div>

            {/* Error message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-400/30 text-red-300 text-sm text-center"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit}>
                {/* OTP Inputs */}
                <motion.div {...delay(0.35)} className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, i) => (
                        <input
                            key={i}
                            ref={(el) => (inputRefs.current[i] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(i, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                            onPaste={i === 0 ? handlePaste : undefined}
                            className={`w-12 h-14 rounded-xl text-center text-xl font-bold transition-all duration-300 focus:outline-none ${digit
                                ? 'bg-primary-500/20 border-primary-400/50 text-white ring-2 ring-primary-400/20'
                                : 'bg-white/5 border-white/10 text-white/80'
                                } border focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/25`}
                        />
                    ))}
                </motion.div>

                {/* Timer */}
                <motion.div {...delay(0.4)} className="text-center mb-6">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="text-sm text-primary-300 hover:text-primary-200 font-semibold transition-colors disabled:opacity-50"
                        >
                            {resending ? 'Resending...' : 'Resend Code'}
                        </button>
                    ) : (
                        <p className="text-sm text-white/30">
                            Resend code in{' '}
                            <span className="text-primary-300 font-mono font-semibold">{formatTime(timer)}</span>
                        </p>
                    )}
                </motion.div>

                {/* Verify Button */}
                <motion.button
                    {...delay(0.45)}
                    type="submit"
                    disabled={!otp.every((d) => d !== '') || loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Verifying...
                        </span>
                    ) : (
                        'Verify Email'
                    )}
                </motion.button>
            </form>

            {/* Progress dots */}
            <motion.div {...delay(0.5)} className="flex justify-center gap-2 mt-6">
                {[0, 1, 2].map((step) => (
                    <div
                        key={step}
                        className={`h-1.5 rounded-full transition-all duration-300 ${step <= 1 ? 'w-6 bg-primary-400' : 'w-1.5 bg-white/15'
                            }`}
                    />
                ))}
            </motion.div>
        </AuthLayout>
    );
}
