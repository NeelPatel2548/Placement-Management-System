import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiBell, HiChevronDown, HiLogout, HiUser, HiCog } from 'react-icons/hi';
import api from '../../services/api';
import { useRefreshOnChange } from '../../hooks/useRefreshOnChange';

export default function TopNavbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await api.get('/api/notifications');
            const notifications = res.data.notifications || [];
            setUnreadCount(notifications.filter(n => !n.isRead).length);
        } catch {
            // silent fail on nav badge
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useRefreshOnChange(fetchNotifications);

    const handleLogout = () => {
        localStorage.removeItem('pms_token');
        localStorage.removeItem('pms_user');
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-between h-16 px-6 bg-[#0a0c14]/80 backdrop-blur-xl border-b border-white/5">
            {/* Left — Greeting */}
            <div>
                <p className="text-white/80 text-sm font-medium">Welcome, <span className="text-white">{user.name || 'User'}</span></p>
            </div>

            {/* Right — Notifications + Profile */}
            <div className="flex items-center gap-4">
                {/* Notification bell */}
                <button
                    onClick={() => navigate(user.role === 'student' ? '/student/notifications' : user.role === 'company' ? '/company/notifications' : '/admin/notifications')}
                    className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <HiBell className="w-5 h-5 text-white/60" />
                    {unreadCount > 0 && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                    )}
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                            {(user.name || 'U')[0].toUpperCase()}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-white text-sm font-medium leading-tight">{user.name || 'User'}</p>
                            <p className="text-white/30 text-[10px]">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}</p>
                        </div>
                        <HiChevronDown className={`w-4 h-4 text-white/30 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-[#151825] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="p-3 border-b border-white/5">
                                        <p className="text-white text-sm font-medium">{user.name || 'User'}</p>
                                        <p className="text-white/30 text-xs">{user.email}</p>
                                    </div>
                                    <div className="p-1.5">
                                        <button onClick={() => { setDropdownOpen(false); navigate(user.role === 'student' ? '/student/profile' : '/profile'); }}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 text-white/60 text-sm hover:bg-white/5 rounded-lg transition-colors">
                                            <HiUser className="w-4 h-4" /> View Profile
                                        </button>
                                        <button onClick={() => { setDropdownOpen(false); navigate(user.role === 'student' ? '/student/profile' : '/settings'); }}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 text-white/60 text-sm hover:bg-white/5 rounded-lg transition-colors">
                                            <HiCog className="w-4 h-4" /> Settings
                                        </button>
                                        <button onClick={handleLogout}
                                            className="flex items-center gap-2.5 w-full px-3 py-2 text-red-400 text-sm hover:bg-red-500/10 rounded-lg transition-colors">
                                            <HiLogout className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
