import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiBriefcase, HiUsers, HiClipboardCheck, HiTrendingUp, HiCalendar, HiClock } from 'react-icons/hi';
import { Loader2, Bell } from 'lucide-react';
import StatsCard from '../dashboard/StatsCard';
import api from '../../services/api';
import { useRefreshOnChange } from '../../hooks/useRefreshOnChange';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    shortlisted: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function CompanyHome() {
    const [stats, setStats] = useState({ activeJobs: 0, totalApplicants: 0, interviews: 0, selected: 0 });
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companyName, setCompanyName] = useState('');
    const [isApproved, setIsApproved] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const [dashboardRes, appsRes, ivsRes, notifsRes] = await Promise.all([
                api.get('/api/company/dashboard').catch(() => ({ data: { stats: {} } })),
                api.get('/api/company/applications').catch(() => ({ data: { applications: [] } })),
                api.get('/api/company/interviews').catch(() => ({ data: { interviews: [] } })),
                api.get('/api/notifications').catch(() => ({ data: { notifications: [] } })),
            ]);

            const dashData = dashboardRes.data;
            setStats(dashData.stats || { activeJobs: 0, totalApplicants: 0, interviews: 0, selected: 0 });
            setCompanyName(dashData.user?.name || 'Company');
            setIsApproved(dashData.isApproved !== false);
            setApplications(appsRes.data.applications || []);
            setInterviews(ivsRes.data.interviews || []);
            setNotifications(notifsRes.data.notifications || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useRefreshOnChange(fetchData);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <p className="text-red-400 text-sm">{error}</p>
                <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

    const recentApps = applications.slice(0, 5);
    const upcomingInterviews = [...interviews]
        .filter(iv => {
            const d = iv.scheduledDate || iv.interviewDate;
            return d && new Date(d) >= new Date();
        })
        .sort((a, b) => new Date(a.scheduledDate || a.interviewDate) - new Date(b.scheduledDate || b.interviewDate))
        .slice(0, 3);
    const unreadNotifs = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-accent-500/10 border border-primary-500/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Welcome, {companyName} 👋</h1>
                        <p className="text-white/40 text-sm mt-1">Company Dashboard Overview</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isApproved && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-amber-500/15 text-amber-400 border-amber-500/20">
                                ⏳ Pending Approval
                            </span>
                        )}
                        {isApproved && (
                            <span className="px-3 py-1.5 rounded-full text-xs font-semibold border bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
                                ✓ Approved
                            </span>
                        )}
                        <div className="relative">
                            <Bell className="w-5 h-5 text-white/40" />
                            {unreadNotifs > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                    {unreadNotifs > 9 ? '9+' : unreadNotifs}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={HiBriefcase} label="Active Jobs" value={stats.activeJobs} color="indigo" delay={0.1} />
                <StatsCard icon={HiUsers} label="Total Applicants" value={stats.totalApplicants} color="emerald" delay={0.15} />
                <StatsCard icon={HiCalendar} label="Interviews" value={stats.interviews} color="amber" delay={0.2} />
                <StatsCard icon={HiTrendingUp} label="Selected" value={stats.selected} color="rose" delay={0.25} />
            </div>

            {/* Recent Applications + Upcoming Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Applications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Recent Applications</h2>
                        <a href="/company/applicants" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                    </div>
                    {recentApps.length === 0 ? (
                        <div className="text-center py-8">
                            <HiUsers className="w-10 h-10 text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-sm">No applications yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-white/30 text-xs border-b border-white/5">
                                    <th className="text-left pb-3 font-medium">Student</th>
                                    <th className="text-left pb-3 font-medium">Role</th>
                                    <th className="text-left pb-3 font-medium">Status</th>
                                </tr></thead>
                                <tbody>
                                    {recentApps.map(app => (
                                        <tr key={app._id} className="border-b border-white/5 last:border-0">
                                            <td className="py-3 text-white/80 font-medium">
                                                {app.studentId?.userId?.name || app.studentId?.userId?.email || app.studentId?.enrollmentNo || 'N/A'}
                                            </td>
                                            <td className="py-3 text-white/50">{app.jobId?.title || 'N/A'}</td>
                                            <td className="py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status] || 'bg-gray-500/15 text-gray-400'}`}>
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
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Upcoming Interviews</h2>
                    {upcomingInterviews.length === 0 ? (
                        <div className="text-center py-8">
                            <HiCalendar className="w-10 h-10 text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-sm">No upcoming interviews.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingInterviews.map(iv => {
                                const student = iv.applicationId?.studentId;
                                const job = iv.applicationId?.jobId;
                                const ivDate = iv.scheduledDate || iv.interviewDate;
                                return (
                                    <div key={iv._id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-primary-500/20 transition-all">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-white font-medium text-sm">
                                                    {student?.userId?.name || student?.enrollmentNo || 'Student'}
                                                </h3>
                                                <p className="text-white/40 text-xs mt-0.5">
                                                    {job?.title || 'Position'} • {ivDate ? new Date(ivDate).toLocaleDateString() : 'TBD'}
                                                </p>
                                            </div>
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                iv.mode === 'online' || iv.interviewType === 'online'
                                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                            }`}>
                                                {(iv.mode || iv.interviewType || 'TBD').charAt(0).toUpperCase() + (iv.mode || iv.interviewType || 'TBD').slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Notifications */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">Recent Notifications</h2>
                    <a href="/company/notifications" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                </div>
                {notifications.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-white/30 text-sm">No notifications yet.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.slice(0, 4).map(n => (
                            <div key={n._id} className={`p-3 rounded-xl border transition-colors ${!n.isRead ? 'bg-primary-500/5 border-primary-500/10' : 'bg-white/[0.02] border-white/5'}`}>
                                <p className="text-white/80 text-sm font-medium">{n.title}</p>
                                <p className="text-white/30 text-xs mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
