import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/student/analytics');
                setAnalytics(res.data.analytics || {});
            } catch (err) {
                setError('Failed to load analytics');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">Retry</button>
            </div>
        );
    }

    const placementProgress = analytics?.placementProgress || [];
    const totalApplications = analytics?.totalApplications || 0;

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-white/40 text-sm mt-1">Track your placement journey progress</p>
            </motion.div>

            {/* Summary Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Application Summary</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {placementProgress.map((item, i) => (
                        <div key={item.name} className="text-center p-3 rounded-xl bg-white/[0.03]">
                            <p className="text-2xl font-bold" style={{ color: COLORS[i % COLORS.length] }}>{item.value}</p>
                            <p className="text-white/40 text-xs mt-0.5">{item.name}</p>
                        </div>
                    ))}
                </div>
                {totalApplications === 0 && (
                    <p className="text-white/30 text-sm text-center mt-4">No application data yet. Start applying to see your analytics!</p>
                )}
            </motion.div>

            {totalApplications > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Placement Progress Pie */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                        <h2 className="text-white font-semibold mb-6">Placement Progress</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={placementProgress} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                                    dataKey="value" paddingAngle={4} labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {placementProgress.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Status Bar Chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                        <h2 className="text-white font-semibold mb-6">Application Status Breakdown</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={placementProgress} barGap={6}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} allowDecimals={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} name="Count" />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
