import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Briefcase, CalendarDays, Award, Shield, Megaphone, Loader2 } from 'lucide-react';
import api from '../../services/api';

const typeIcons = {
    job: Briefcase,
    interview: CalendarDays,
    result: Award,
    security: Shield,
    announcement: Megaphone,
    system: Bell,
};

const typeColors = {
    job: 'bg-blue-500/15 text-blue-400',
    interview: 'bg-purple-500/15 text-purple-400',
    result: 'bg-emerald-500/15 text-emerald-400',
    security: 'bg-red-500/15 text-red-400',
    announcement: 'bg-amber-500/15 text-amber-400',
    system: 'bg-gray-500/15 text-gray-400',
};

export default function CompanyNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/api/notifications');
                setNotifications(res.data.notifications || []);
            } catch (err) {
                console.error('Fetch notifications error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Notifications</h1>
                <p className="text-white/40 text-sm">Stay updated with the latest activity</p>
            </div>

            {notifications.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <Bell className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No notifications yet</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="divide-y divide-white/5">
                        {notifications.map(n => {
                            const IconComp = typeIcons[n.type] || Bell;
                            const colorClass = typeColors[n.type] || 'bg-gray-500/15 text-gray-400';
                            return (
                                <div key={n._id} className={`flex items-start gap-4 p-4 hover:bg-white/[0.02] transition-colors ${!n.isRead ? 'bg-blue-500/[0.03] border-l-2 border-l-blue-500' : ''}`}>
                                    <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
                                        <IconComp className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <p className={`text-sm font-medium ${!n.isRead ? 'text-white' : 'text-white/70'}`}>{n.title}</p>
                                                <p className="text-white/40 text-xs mt-1 leading-relaxed">{n.message}</p>
                                            </div>
                                            <span className="text-white/20 text-[10px] flex-shrink-0 mt-0.5">
                                                {n.timestamp ? new Date(n.timestamp).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                    </div>
                                    {!n.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
