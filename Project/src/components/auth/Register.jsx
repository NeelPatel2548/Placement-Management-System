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

export default function Register() {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [role, setRole] = useState('student');
    const [agreed, setAgreed] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });

    const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/verify-otp');
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
                <motion.div {...delay(0.45)} className="relative">
                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Password"
                        value={form.password}
                        onChange={update('password')}
                        className={`${inputClass} pr-11`}
                        required
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                        {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
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
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                    Create Account
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
