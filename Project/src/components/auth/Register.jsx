import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { HiAcademicCap, HiOfficeBuilding } from 'react-icons/hi';
import AuthLayout from './AuthLayout';

const roles = [
    { id: 'student', label: 'Student', icon: HiAcademicCap, desc: 'Looking for jobs' },
    { id: 'company', label: 'Company', icon: HiOfficeBuilding, desc: 'Hiring talent' },
];

// Password validation regex
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

export default function Register() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [role, setRole] = useState('student');
    const [agreed, setAgreed] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    // Password strength checker
    const getPasswordStrength = (pwd) => {
        if (!pwd) return { level: 0, label: '', color: '' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;

        if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-400' };
        if (score <= 3) return { level: score, label: 'Fair', color: 'bg-yellow-400' };
        if (score <= 4) return { level: score, label: 'Good', color: 'bg-blue-400' };
        return { level: score, label: 'Strong', color: 'bg-emerald-400' };
    };

    const pwdStrength = getPasswordStrength(form.password);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (form.password !== form.confirm) {
            setError('Passwords do not match');
            return;
        }

        if (!PASSWORD_REGEX.test(form.password)) {
            setError('Password must contain uppercase, lowercase, number and special character.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.message);
                return;
            }

            // Store info for OTP verification page
            localStorage.setItem('pms_verify_email', form.email);
            localStorage.setItem('pms_verify_name', form.name);
            localStorage.setItem('pms_otp_purpose', 'register');
            navigate('/verify-otp');
        } catch (err) {
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300';

    const delay = (d) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

    return (
        <AuthLayout>
            <div className="text-center mb-7">
                <motion.h1 {...delay(0.15)} className="text-2xl font-bold text-white mb-2">
                    Create Account
                </motion.h1>
                <motion.p {...delay(0.25)} className="text-white/40 text-sm">
                    Join the placement portal today
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

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role Selector */}
                <motion.div {...delay(0.3)} className="grid grid-cols-2 gap-3 mb-1">
                    {roles.map((r) => (
                        <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={`relative p-3.5 rounded-xl border text-left transition-all duration-300 group ${role === r.id
                                ? 'bg-primary-500/15 border-primary-400/40 shadow-lg shadow-primary-500/10'
                                : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                                }`}
                        >
                            <r.icon className={`w-6 h-6 mb-1.5 transition-colors ${role === r.id ? 'text-primary-400' : 'text-white/30 group-hover:text-white/50'}`} />
                            <div className={`text-sm font-semibold transition-colors ${role === r.id ? 'text-white' : 'text-white/60'}`}>{r.label}</div>
                            <div className={`text-[11px] transition-colors ${role === r.id ? 'text-white/50' : 'text-white/25'}`}>{r.desc}</div>
                            {role === r.id && (
                                <motion.div
                                    layoutId="role-indicator"
                                    className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-primary-400 shadow shadow-primary-400/50"
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Full Name */}
                <motion.div {...delay(0.35)} className="relative">
                    <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input type="text" placeholder="Full Name" value={form.name} onChange={update('name')} className={inputClass} required />
                </motion.div>

                {/* Email */}
                <motion.div {...delay(0.4)} className="relative">
                    <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input type="email" placeholder="Email Address" value={form.email} onChange={update('email')} className={inputClass} required />
                </motion.div>

                {/* Password */}
                <motion.div {...delay(0.45)} className="space-y-2">
                    <div className="relative">
                        <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                        <input
                            type={showPass ? 'text' : 'password'}
                            placeholder="Password (min 8 chars, A-z, 0-9, !@#)"
                            value={form.password}
                            onChange={update('password')}
                            className={`${inputClass} pr-11`}
                            required
                        />
                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                            {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                        </button>
                    </div>
                    {/* Password strength indicator */}
                    {form.password && (
                        <div className="flex items-center gap-2 px-1">
                            <div className="flex-1 flex gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= pwdStrength.level ? pwdStrength.color : 'bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className={`text-[11px] font-medium ${pwdStrength.level <= 2 ? 'text-red-400' :
                                    pwdStrength.level <= 3 ? 'text-yellow-400' :
                                        pwdStrength.level <= 4 ? 'text-blue-400' :
                                            'text-emerald-400'
                                }`}>
                                {pwdStrength.label}
                            </span>
                        </div>
                    )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div {...delay(0.5)} className="relative">
                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={form.confirm}
                        onChange={update('confirm')}
                        className={`${inputClass} pr-11`}
                        required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                        {showConfirm ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                </motion.div>

                {/* Terms */}
                <motion.label {...delay(0.55)} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="sr-only peer" required />
                        <div className="w-5 h-5 rounded-md border border-white/20 bg-white/5 peer-checked:bg-primary-500 peer-checked:border-primary-400 transition-all flex items-center justify-center">
                            {agreed && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                    </div>
                    <span className="text-xs text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                        I agree to the{' '}
                        <Link to="#" className="text-primary-300 hover:text-primary-200">Terms & Conditions</Link>
                        {' '}and{' '}
                        <Link to="#" className="text-primary-300 hover:text-primary-200">Privacy Policy</Link>
                    </span>
                </motion.label>

                {/* Submit */}
                <motion.button
                    {...delay(0.6)}
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Creating Account...
                        </span>
                    ) : (
                        'Create Account'
                    )}
                </motion.button>
            </form>

            {/* Login link */}
            <motion.p {...delay(0.65)} className="text-center mt-6 text-sm text-white/40">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-300 hover:text-primary-200 font-semibold transition-colors">
                    Sign In
                </Link>
            </motion.p>
        </AuthLayout>
    );
}
