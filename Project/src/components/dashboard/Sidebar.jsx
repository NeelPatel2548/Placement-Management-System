import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiHome, HiUser, HiBriefcase, HiDocumentText, HiCalendar,
    HiAcademicCap, HiBell, HiChatAlt2, HiCog, HiChevronLeft, HiX
} from 'react-icons/hi';

const navItems = [
    { path: '/student', icon: HiHome, label: 'Dashboard', end: true },
    { path: '/student/profile', icon: HiUser, label: 'Profile' },
    { path: '/student/jobs', icon: HiBriefcase, label: 'Jobs' },
    { path: '/student/applications', icon: HiDocumentText, label: 'Applications' },
    { path: '/student/interviews', icon: HiCalendar, label: 'Interviews' },
    { path: '/student/practice-tests', icon: HiAcademicCap, label: 'Practice Tests' },
    { path: '/student/notifications', icon: HiBell, label: 'Notifications' },
    { path: '/student/messages', icon: HiChatAlt2, label: 'Messages' },
    { path: '/student/settings', icon: HiCog, label: 'Settings' },
];

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
    const location = useLocation();

    const linkClass = (isActive) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
            ? 'bg-primary-500/15 text-primary-400 shadow-sm shadow-primary-500/10'
            : 'text-white/50 hover:text-white/80 hover:bg-white/5'
        }`;

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    P
                </div>
                {!collapsed && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h1 className="text-white font-bold text-lg leading-none">PMS</h1>
                        <p className="text-white/30 text-[10px]">Student Portal</p>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
                {navItems.map(({ path, icon: Icon, label, end }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={end}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => linkClass(isActive)}
                    >
                        <Icon className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Collapse toggle (desktop) */}
            <div className="hidden lg:block px-3 py-4 border-t border-white/5">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-all w-full text-sm"
                >
                    <HiChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
                    {!collapsed && <span>Collapse</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-[#0c0e1a] border-r border-white/5 z-40 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-screen w-64 bg-[#0c0e1a] border-r border-white/5 z-50 lg:hidden"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white/80 transition-colors"
                            >
                                <HiX className="w-5 h-5" />
                            </button>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
