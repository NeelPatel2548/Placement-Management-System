import { motion } from 'framer-motion';
import { HiAcademicCap, HiOfficeBuilding, HiBriefcase, HiLightningBolt } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const floatingShapes = [
    { icon: HiAcademicCap, x: '8%', y: '15%', size: 28, delay: 0 },
    { icon: HiOfficeBuilding, x: '88%', y: '12%', size: 24, delay: 0.5 },
    { icon: HiBriefcase, x: '82%', y: '78%', size: 30, delay: 1 },
    { icon: HiLightningBolt, x: '12%', y: '80%', size: 22, delay: 1.5 },
];

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]" />

            {/* Animated orbs */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-primary-600/15 blur-[120px]"
            />
            <motion.div
                animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-accent-500/15 blur-[120px]"
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            {/* Floating icons */}
            {floatingShapes.map(({ icon: Icon, x, y, size, delay }, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white/10"
                    style={{ left: x, top: y }}
                    animate={{ y: [0, -18, 0], rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 5 + i, repeat: Infinity, ease: 'easeInOut', delay }}
                >
                    <Icon size={size} />
                </motion.div>
            ))}

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                        <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl text-white">PMS</span>
                        <span className="block text-[10px] text-white/50 leading-none">Placement Management</span>
                    </div>
                </Link>

                {/* Card */}
                <div className="bg-white/[0.07] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
