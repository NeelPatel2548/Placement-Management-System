import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi';
import AuthLayout from './AuthLayout';

export default function VerifySuccess() {
    return (
        <AuthLayout>
            <div className="text-center py-4">
                {/* Animated checkmark */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.2 }}
                    className="flex justify-center mb-6"
                >
                    <div className="relative">
                        {/* Outer ring */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.5 }}
                            className="absolute inset-0 -m-3 rounded-full bg-emerald-400/10"
                        />
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.15, duration: 0.5 }}
                            className="absolute inset-0 -m-6 rounded-full bg-emerald-400/5"
                        />
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
                            >
                                <HiCheckCircle className="w-10 h-10 text-white" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Confetti particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 0, x: 0 }}
                        animate={{
                            opacity: [0, 1, 0],
                            y: [0, -60 - Math.random() * 40],
                            x: [(Math.random() - 0.5) * 120],
                        }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                        className="absolute left-1/2 top-1/3 w-1.5 h-1.5 rounded-full"
                        style={{
                            backgroundColor: ['#6366f1', '#a855f7', '#10b981', '#f59e0b', '#ec4899'][i % 5],
                        }}
                    />
                ))}

                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-white mb-2"
                >
                    Email Verified Successfully!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/40 text-sm mb-8 leading-relaxed"
                >
                    Your account has been verified. You can now access
                    <br />
                    all features of the Placement Management System.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    >
                        Go to Login
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </motion.div>

                {/* Progress dots */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex justify-center gap-2 mt-8"
                >
                    {[0, 1, 2].map((step) => (
                        <div key={step} className="h-1.5 w-6 rounded-full bg-emerald-400 transition-all" />
                    ))}
                </motion.div>
            </div>
        </AuthLayout>
    );
}
