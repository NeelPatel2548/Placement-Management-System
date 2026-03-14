import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiUsers, HiOfficeBuilding, HiBriefcase, HiStar, HiClipboardCheck, HiTrendingUp } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminHome() {
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ totalStudents: 0, totalCompanies: 0, activeJobs: 0, totalPlacements: 0, pendingCompanies: 0, totalApplications: 0 });
    const [analytics, setAnalytics] = useState({ branchWise: [], companyWise: [], placementPercentage: 0, averageSalary: 0, highestSalary: 0 });
    const [pendingCompanies, setPendingCompanies] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, analyticsRes, companiesRes] = await Promise.allSettled([
                    api.get('/api/admin/dashboard'),
                    api.get('/api/admin/analytics'),
                    api.get('/api/admin/companies'),
                ]);
                if (dashRes.status === 'fulfilled') setStats(dashRes.value.data.stats);
                if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data.analytics);
                if (companiesRes.status === 'fulfilled') {
                    const pending = (companiesRes.value.data.companies || []).filter(c => !c.isApproved);
                    setPendingCompanies(pending);
                }
            } catch (err) {
                setError('Failed to load dashboard');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleApprove = async (companyId) => {
        try {
            await api.put(`/api/admin/companies/${companyId}/approve`);
            setPendingCompanies(prev => prev.filter(c => c._id !== companyId));
            setStats(prev => ({ ...prev, pendingCompanies: prev.pendingCompanies - 1 }));
        } catch (err) { console.error('Approve error:', err); }
    };

    const handleReject = async (companyId) => {
        try {
            await api.put(`/api/admin/companies/${companyId}/reject`);
            setPendingCompanies(prev => prev.filter(c => c._id !== companyId));
        } catch (err) { console.error('Reject error:', err); }
    };

    const statCards = [
        { label: 'Total Students', value: stats.totalStudents, icon: HiUsers, gradient: 'from-indigo-500 to-violet-500' },
        { label: 'Companies', value: stats.totalCompanies, icon: HiOfficeBuilding, gradient: 'from-emerald-500 to-teal-500' },
        { label: 'Active Jobs', value: stats.activeJobs, icon: HiBriefcase, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Placements', value: stats.totalPlacements, icon: HiStar, gradient: 'from-rose-500 to-pink-500' },
        { label: 'Pending Approvals', value: stats.pendingCompanies, icon: HiClipboardCheck, gradient: 'from-cyan-500 to-blue-500' },
        { label: 'Total Applications', value: stats.totalApplications, icon: HiTrendingUp, gradient: 'from-purple-500 to-fuchsia-500' },
    ];

    const branchPieData = (analytics.branchWise || []).map(b => ({ name: b._id, value: b.placed }));
    const monthlyData = analytics.monthlyPlacements || [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-rose-600/20 via-pink-500/10 to-fuchsia-500/10 border border-rose-500/10 rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-white">Admin Dashboard 🛡️</h1>
                <p className="text-white/40 text-sm mt-1">System overview and placement management</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {statCards.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all group">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-3 opacity-80 group-hover:opacity-100 transition-opacity`}>
                            <s.icon className="w-4.5 h-4.5 text-white" />
                        </div>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                        <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Placements Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Monthly Placements</h2>
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#1a1c2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                <Bar dataKey="placements" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" />
                                        <stop offset="100%" stopColor="#ec4899" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-white/30 text-sm text-center py-12">No placement data yet</p>
                    )}
                </motion.div>

                {/* Branch-wise Pie Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Branch-wise Placements</h2>
                    {branchPieData.length > 0 ? (
                        <div className="flex items-center">
                            <ResponsiveContainer width="50%" height={220}>
                                <PieChart>
                                    <Pie data={branchPieData} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                                        {branchPieData.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#1a1c2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex-1 space-y-2">
                                {(analytics.branchWise || []).map((b, i) => (
                                    <div key={b._id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}></span>
                                            <span className="text-white/60">{b._id}</span>
                                        </div>
                                        <span className="text-white/40">{b.placed}/{b.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-white/30 text-sm text-center py-12">No branch data yet</p>
                    )}
                </motion.div>
            </div>

            {/* Pending Companies + Key Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                    className="lg:col-span-2 bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Pending Company Approvals</h2>
                        <a href="/admin/companies" className="text-rose-400 text-xs font-medium hover:text-rose-300">View All →</a>
                    </div>
                    {pendingCompanies.length === 0 ? (
                        <p className="text-white/30 text-sm text-center py-6">No pending approvals</p>
                    ) : (
                        <div className="space-y-2">
                            {pendingCompanies.map(c => (
                                <div key={c._id} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400 font-bold text-sm">{(c.companyName || '?').charAt(0)}</div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{c.companyName}</p>
                                            <p className="text-white/30 text-xs">{c.userId?.email || ''} · {c.location || ''}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApprove(c._id)} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-medium hover:bg-emerald-500/30 transition-colors">Approve</button>
                                        <button onClick={() => handleReject(c._id)} className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition-colors">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Key Metrics */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 space-y-4">
                    <h2 className="text-white font-semibold">Key Metrics</h2>
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/40 text-xs">Placement Rate</p>
                            <p className="text-2xl font-bold text-rose-400 mt-1">{analytics.placementPercentage || 0}%</p>
                            <div className="w-full h-2 bg-white/5 rounded-full mt-2 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" style={{ width: `${analytics.placementPercentage || 0}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/40 text-xs">Average Package</p>
                            <p className="text-2xl font-bold text-emerald-400 mt-1">₹{((analytics.averageSalary || 0) / 100000).toFixed(1)} LPA</p>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-white/40 text-xs">Highest Package</p>
                            <p className="text-2xl font-bold text-amber-400 mt-1">₹{((analytics.highestSalary || 0) / 100000).toFixed(1)} LPA</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
