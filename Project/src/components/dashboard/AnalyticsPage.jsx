import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

const COLORS = ['#6366f1', '#f59e0b', '#a855f7', '#10b981', '#ef4444'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1a1d2e] border border-white/10 rounded-lg p-3 shadow-xl text-xs">
            {label && <p className="text-white/50 mb-1">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} className="text-white font-medium">{p.name}: <span style={{ color: p.color }}>{p.value}</span></p>
            ))}
        </div>
    );
};

export default function AnalyticsPage() {
    const [applications, setApplications] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const [appsRes, profileRes] = await Promise.all([
                api.get('/api/student/applications'),
                api.get('/api/student/profile').catch(() => ({ data: {} })),
            ]);
            setApplications(appsRes.data.applications || []);
            setProfile(profileRes.data.student || null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    if (applications.length === 0) {
        return (
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-white/40 text-sm mt-1">Track your placement journey progress</p>
                </motion.div>
                <div className="flex flex-col items-center justify-center h-[40vh] gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <p className="text-white/40 text-sm">No application data to show yet. Apply to jobs to see your analytics.</p>
                </div>
            </div>
        );
    }

    // Chart 1: Application status distribution (Pie)
    const statusCounts = {};
    applications.forEach(app => {
        const s = app.status || 'applied';
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
    }));

    // Chart 2: Applications over time (Bar)
    const monthCounts = {};
    applications.forEach(app => {
        const date = new Date(app.appliedAt || app.createdAt);
        const key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        monthCounts[key] = (monthCounts[key] || 0) + 1;
    });
    const timeData = Object.entries(monthCounts)
        .sort((a, b) => {
            const da = new Date(a[0]);
            const db = new Date(b[0]);
            return da - db;
        })
        .map(([month, count]) => ({ month, applications: count }));

    // Chart 3: CGPA comparison
    const studentCgpa = profile?.cgpa || 0;
    const appliedJobCgpas = applications
        .map(app => app.jobId?.minCGPA || app.jobId?.eligibilityCgpa)
        .filter(c => c != null);
    const avgRequiredCgpa = appliedJobCgpas.length > 0
        ? Number((appliedJobCgpas.reduce((a, b) => a + b, 0) / appliedJobCgpas.length).toFixed(2))
        : 0;
    const maxRequiredCgpa = appliedJobCgpas.length > 0
        ? Math.max(...appliedJobCgpas)
        : 0;
    const cgpaData = [
        { label: 'Your CGPA', value: studentCgpa },
        { label: 'Avg Required', value: avgRequiredCgpa },
        { label: 'Max Required', value: maxRequiredCgpa },
    ];

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-white/40 text-sm mt-1">Track your placement journey progress ({applications.length} applications)</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications Over Time (Bar) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-6">Applications Over Time</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={timeData} barGap={6}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="applications" fill="#6366f1" radius={[6, 6, 0, 0]} name="Applications" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Status Distribution (Pie) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-6">Application Status</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                                dataKey="value" paddingAngle={4} labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {statusData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* CGPA Comparison (Bar) */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 lg:col-span-2">
                    <h2 className="text-white font-semibold mb-6">CGPA Comparison</h2>
                    <p className="text-white/30 text-xs mb-4">Your CGPA compared against the average and maximum required CGPA of jobs you've applied to</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={cgpaData} barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} domain={[0, 10]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" name="CGPA" radius={[6, 6, 0, 0]}>
                                <Cell fill="#10b981" />
                                <Cell fill="#6366f1" />
                                <Cell fill="#ef4444" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
