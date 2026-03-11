import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, FileText, CalendarDays, UserCheck, MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    hired: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function CompanyHome() {
    const [stats, setStats] = useState({ totalJobs: 0, totalApplications: 0, scheduledInterviews: 0, totalHired: 0 });
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appsRes, intRes, notifRes] = await Promise.all([
                    api.get('/api/dashboard/stats'),
                    api.get('/api/applications'),
                    api.get('/api/interviews'),
                    api.get('/api/notifications'),
                ]);
                setStats(statsRes.data.stats);
                setApplications(appsRes.data.applications || []);
                setInterviews(intRes.data.interviews || []);
                setNotifications(notifRes.data.notifications || []);
            } catch (error) {
                console.error('Dashboard fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statCards = [
        { label: 'Jobs Posted', value: stats.totalJobs, icon: Briefcase, gradient: 'from-blue-500 to-blue-600' },
        { label: 'Applications', value: stats.totalApplications, icon: FileText, gradient: 'from-purple-500 to-violet-600' },
        { label: 'Interviews', value: stats.scheduledInterviews, icon: CalendarDays, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Hired', value: stats.totalHired, icon: UserCheck, gradient: 'from-emerald-500 to-teal-500' },
    ];

    const upcomingInterviews = interviews.filter(i => i.status === 'scheduled').slice(0, 3);
    const recentApps = applications.slice(0, 5);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600/20 via-blue-500/10 to-purple-500/10 border border-blue-500/10 rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-white">Welcome, {user.name || 'Company'} 👋</h1>
                <p className="text-white/40 text-sm mt-1">Manage your recruitment drives and applicants</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">{s.value}</p>
                                <p className="text-white/40 text-sm mt-1">{s.label}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity shadow-lg`}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Applications + Upcoming Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Applications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-[#111827] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Recent Applications</h2>
                        <Link to="/company/applications" className="text-blue-400 text-xs font-medium hover:text-blue-300 flex items-center gap-1">
                            View All <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>
                    {recentApps.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-8">No applications yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-white/30 text-xs border-b border-white/5">
                                        <th className="text-left pb-3 font-medium">Student</th>
                                        <th className="text-left pb-3 font-medium">Job Title</th>
                                        <th className="text-left pb-3 font-medium">Applied</th>
                                        <th className="text-left pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentApps.map(app => (
                                        <tr key={app._id} className="border-b border-white/5 last:border-0">
                                            <td className="py-3 text-white/80 font-medium">{app.studentName || 'N/A'}</td>
                                            <td className="py-3 text-white/50">{app.jobTitle || 'N/A'}</td>
                                            <td className="py-3 text-white/40 text-xs">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                                            <td className="py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status] || 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
                                                    {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Upcoming Interviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-[#111827] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Upcoming Interviews</h2>
                    {upcomingInterviews.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-8">No upcoming interviews</p>
                    ) : (
                        <div className="space-y-3">
                            {upcomingInterviews.map(iv => (
                                <div key={iv._id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-blue-500/20 transition-all">
                                    <h3 className="text-white font-medium text-sm">{iv.studentName || 'N/A'}</h3>
                                    <p className="text-white/40 text-xs mt-0.5">{iv.jobTitle || 'N/A'}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-white/30 text-[11px] flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {iv.scheduledDate ? new Date(iv.scheduledDate).toLocaleDateString() : '—'} · {iv.scheduledTime || ''}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${iv.mode === 'online' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                                            {iv.mode === 'online' ? '🎥 Online' : '🏢 Offline'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Recent Notifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-[#111827] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">Recent Notifications</h2>
                    <Link to="/company/notifications" className="text-blue-400 text-xs font-medium hover:text-blue-300 flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                {notifications.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-6">No notifications</p>
                ) : (
                    <div className="space-y-2">
                        {notifications.slice(0, 3).map(n => (
                            <div key={n._id} className={`flex items-start gap-3 p-3 rounded-xl transition-all ${!n.isRead ? 'bg-blue-500/5 border border-blue-500/10' : 'bg-white/[0.02] border border-transparent'}`}>
                                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Bell className="w-4 h-4 text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white/80 text-sm font-medium">{n.title}</p>
                                    <p className="text-white/40 text-xs mt-0.5 truncate">{n.message}</p>
                                </div>
                                <span className="text-white/20 text-[10px] flex-shrink-0">{n.timestamp ? new Date(n.timestamp).toLocaleDateString() : ''}</span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
