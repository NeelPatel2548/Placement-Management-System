import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Jobs', href: '#features' },
    { name: 'Companies', href: '#recruiters' },
    { name: 'About', href: '#how-it-works' },
    { name: 'Contact', href: '#footer' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-primary-500/5'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <a href="#home" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-shadow">
                            <span className="text-white font-bold text-lg">P</span>
                        </div>
                        <div>
                            <span className={`font-bold text-xl ${scrolled ? 'text-gray-900' : 'text-white'} transition-colors`}>
                                PMS
                            </span>
                            <span className={`hidden sm:block text-[10px] leading-none ${scrolled ? 'text-gray-500' : 'text-white/60'} transition-colors`}>
                                Placement Management
                            </span>
                        </div>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-500/10 ${scrolled ? 'text-gray-700 hover:text-primary-600' : 'text-white/80 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            to="/login"
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${scrolled
                                ? 'text-primary-600 hover:bg-primary-50'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all duration-200"
                        >
                            Register
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-700' : 'text-white'
                            }`}
                    >
                        {mobileOpen ? <HiX size={24} /> : <HiMenuAlt3 size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-3 flex flex-col gap-2 border-t border-gray-100 mt-2">
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-center text-primary-600 font-semibold hover:bg-primary-50 transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-center bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
