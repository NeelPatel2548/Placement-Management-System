import { motion } from 'framer-motion';
import { HiAcademicCap, HiOfficeBuilding, HiBriefcase, HiChartBar, HiLightningBolt, HiStar } from 'react-icons/hi';

const floatingIcons = [
    { Icon: HiAcademicCap, x: '10%', y: '20%', delay: 0, size: 32, color: 'text-blue-300' },
    { Icon: HiOfficeBuilding, x: '85%', y: '15%', delay: 0.5, size: 28, color: 'text-purple-300' },
    { Icon: HiBriefcase, x: '75%', y: '70%', delay: 1, size: 36, color: 'text-indigo-300' },
    { Icon: HiChartBar, x: '15%', y: '75%', delay: 1.5, size: 30, color: 'text-violet-300' },
    { Icon: HiLightningBolt, x: '50%', y: '10%', delay: 0.8, size: 24, color: 'text-cyan-300' },
    { Icon: HiStar, x: '90%', y: '50%', delay: 1.2, size: 26, color: 'text-pink-300' },
];

export default function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />

            {/* Animated gradient orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-primary-600/20 blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-accent-500/20 blur-[120px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]"
                />
            </div>

            {/* Floating Icons */}
            {floatingIcons.map(({ Icon, x, y, delay, size, color }, i) => (
                <motion.div
                    key={i}
                    className={`absolute ${color} opacity-20`}
                    style={{ left: x, top: y }}
                    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay }}
                >
                    <Icon size={size} />
                </motion.div>
            ))}

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
            }} />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white/80 text-sm font-medium mb-8">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        Trusted by Top Universities
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
                >
                    <span className="bg-gradient-to-r from-primary-300 via-accent-400 to-primary-300 bg-clip-text text-transparent">
                        Placement Management
                    </span>
                    <br />
                    System
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Connecting students with top companies and simplifying campus recruitment
                    through intelligent matching and seamless workflows.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#cta"
                        className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold text-lg shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                    >
                        Get Started
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </a>
                    <a
                        href="#"
                        className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300"
                    >
                        Login
                    </a>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                    {[
                        { value: '10K+', label: 'Students' },
                        { value: '500+', label: 'Companies' },
                        { value: '2K+', label: 'Placements' },
                        { value: '95%', label: 'Success Rate' },
                    ].map((stat, i) => (
                        <div key={i} className="glass rounded-2xl px-4 py-6 text-center">
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-white/50 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 120L48 105C96 90 192 60 288 52.5C384 45 480 60 576 67.5C672 75 768 75 864 67.5C960 60 1056 45 1152 45C1248 45 1344 60 1392 67.5L1440 75V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="white" />
                </svg>
            </div>
        </section>
    );
}
