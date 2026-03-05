import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiBell, HiCheck, HiCheckCircle, HiInformationCircle, HiExclamation, HiShieldCheck } from 'react-icons/hi';
import { mockNotifications } from './mockData';

const typeIcons = {
    success: HiCheckCircle,
    info: HiInformationCircle,
    warning: HiExclamation,
    security: HiShieldCheck,
};

const typeColors = {
    success: 'text-emerald-400 bg-emerald-500/15',
    info: 'text-blue-400 bg-blue-500/15',
    warning: 'text-amber-400 bg-amber-500/15',
    security: 'text-purple-400 bg-purple-500/15',
};

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filter, setFilter] = useState('all');

    const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, read: true })));
    const toggleRead = (id) => setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: !n.read } : n));

    const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter(n => !n.read) : notifications.filter(n => n.read);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notifications</h1>
                    <p className="text-white/40 text-sm mt-1">{unreadCount} unread notifications</p>
                </div>
                {unreadCount > 0 && (
                    <button onClick={markAllRead} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
                        <HiCheck className="w-4 h-4" /> Mark All Read
                    </button>
                )}
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex gap-2">
                {['all', 'unread', 'read'].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-white/40 hover:text-white/60'
                            }`}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                ))}
            </motion.div>

            {/* List */}
            <div className="space-y-2">
                {filtered.map((n, i) => {
                    const Icon = typeIcons[n.type] || HiBell;
                    const color = typeColors[n.type] || typeColors.info;
                    return (
                        <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }}
                            onClick={() => toggleRead(n.id)}
                            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${!n.read ? 'bg-primary-500/5 border-primary-500/10 hover:bg-primary-500/10' : 'bg-[#0f1120] border-white/5 hover:bg-white/[0.03]'
                                }`}>
                            <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
                                <Icon className="w-4.5 h-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-white/90 text-sm font-medium">{n.title}</h3>
                                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary-400" />}
                                </div>
                                <p className="text-white/40 text-xs mt-0.5">{n.message}</p>
                                <p className="text-white/20 text-[11px] mt-1">{n.time}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <HiBell className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">{filter === 'unread' ? 'All caught up!' : 'No notifications'}</p>
                </div>
            )}
        </div>
    );
}
