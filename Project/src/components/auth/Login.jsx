import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { FaGoogle, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import AuthLayout from './AuthLayout';

export default function Login() {
    const [showPass, setShowPass] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login
    };

    const inputClass =
        'w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all duration-300';

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl font-bold text-white mb-2"
                >
                    Welcome Back
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-white/40 text-sm"
                >
                    Sign in to your placement portal
                </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative">
                    <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        required
                    />
                </motion.div>

                {/* Password */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="relative">
                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
                    <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-11`}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                    >
                        {showPass ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                    </button>
                </motion.div>

                {/* Forgot Password */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end">
                    <Link to="#" className="text-xs text-primary-300 hover:text-primary-200 transition-colors">
                        Forgot Password?
                    </Link>
                </motion.div>

                {/* Submit */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                    Sign In
                </motion.button>
            </form>

            {/* Divider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 my-6"
            >
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/25 text-xs font-medium">OR</span>
                <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* Social Login */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex justify-center gap-3"
            >
                {[
                    { icon: FaGoogle, color: 'hover:bg-red-500/20 hover:border-red-400/30' },
                    { icon: FaGithub, color: 'hover:bg-gray-500/20 hover:border-gray-400/30' },
                    { icon: FaLinkedinIn, color: 'hover:bg-blue-500/20 hover:border-blue-400/30' },
                ].map(({ icon: Icon, color }, i) => (
                    <button
                        key={i}
                        className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200 ${color}`}
                    >
                        <Icon size={18} />
                    </button>
                ))}
            </motion.div>

            {/* Register link */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center mt-6 text-sm text-white/40"
            >
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-300 hover:text-primary-200 font-semibold transition-colors">
                    Register
                </Link>
            </motion.p>
        </AuthLayout>
    );
}
