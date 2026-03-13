import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiMenu, HiSearch, HiBell, HiChevronDown, HiLogout, HiCog, HiUser } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

// Using an empty array temporarily since mockData was removed.
// Real notifications are fetched in the NotificationsPage component.
const mockNotifications = [];

export default function TopNavbar({ onMenuClick }) {
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);
    const [showNotif, setShowNotif] = useState(false);

    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const unreadCount = mockNotifications.filter(n => !n.read).length;

    const handleLogout = () => {
        localStorage.removeItem('pms_token');
        localStorage.removeItem('pms_user');
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-30 bg-[#0c0e1a]/80 backdrop-blur-xl border-b border-white/5">
            <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                {/* Left */}
                <div className="flex items-center gap-4">
                    <button onClick={onMenuClick} className="lg:hidden text-white/50 hover:text-white transition-colors">
                        <HiMenu className="w-6 h-6" />
                    </button>
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 w-72">
                        <HiSearch className="w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search jobs, companies..."
                            className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none w-full"
                        />
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
                            className="relative p-2.5 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
                        >
                            <HiBell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotif && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute right-0 top-12 w-80 bg-[#141627] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                                >
                                    <div className="p-4 border-b border-white/5">
                                        <h3 className="text-white font-semibold text-sm">Notifications</h3>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {mockNotifications.slice(0, 4).map(n => (
                                            <div key={n.id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-primary-500/5' : ''}`}>
                                                <p className="text-white/80 text-sm font-medium">{n.title}</p>
                                                <p className="text-white/40 text-xs mt-0.5">{n.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => { navigate('/student/notifications'); setShowNotif(false); }}
                                        className="w-full p-3 text-primary-400 text-sm font-medium hover:bg-white/5 transition-colors"
                                    >
                                        View All
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-sm">
                                {(user.name || 'U')[0].toUpperCase()}
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-white/80 text-sm font-medium leading-none">{user.name || 'Student'}</p>
                                <p className="text-white/30 text-[11px]">{user.role || 'student'}</p>
                            </div>
                            <HiChevronDown className="w-4 h-4 text-white/30 hidden md:block" />
                        </button>

                        <AnimatePresence>
                            {showProfile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    className="absolute right-0 top-12 w-48 bg-[#141627] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                                >
                                    {[
                                        { icon: HiUser, label: 'Profile', action: () => navigate('/student/profile') },
                                        { icon: HiCog, label: 'Settings', action: () => navigate('/student/settings') },
                                        { icon: HiLogout, label: 'Logout', action: handleLogout, danger: true },
                                    ].map(({ icon: Icon, label, action, danger }, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { action(); setShowProfile(false); }}
                                            className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
