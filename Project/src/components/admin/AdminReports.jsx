import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminReports() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ totalStudents: 0, totalPlacements: 0 });
    const [analytics, setAnalytics] = useState({ averageSalary: 0, highestSalary: 0, branchWise: [] });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashRes, analyticsRes] = await Promise.allSettled([
                    api.get('/api/admin/dashboard'),
                    api.get('/api/admin/analytics'),
                ]);
                if (dashRes.status === 'fulfilled') setStats(dashRes.value.data.stats);
                if (analyticsRes.status === 'fulfilled') setAnalytics(analyticsRes.value.data.analytics);
            } catch (err) {
                setError('Failed to load reports');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const branchData = (analytics.branchWise || []).map(b => ({
        branch: b._id,
        total: b.total,
        placed: b.placed,
        rate: b.total > 0 ? Math.round((b.placed / b.total) * 100) : 0,
    }));

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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Placement Reports</h1>
                <p className="text-white/40 text-sm mt-1">Generate and view placement reports</p>
            </motion.div>

            {/* Summary */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">2025-26 Placement Summary</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-white">{stats.totalStudents || 0}</p>
                        <p className="text-white/40 text-xs mt-1">Total Students</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-400">{stats.totalPlacements || 0}</p>
                        <p className="text-white/40 text-xs mt-1">Placed</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-amber-400">₹{((analytics.averageSalary || 0) / 100000).toFixed(1)}L</p>
                        <p className="text-white/40 text-xs mt-1">Avg Package</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-rose-400">₹{((analytics.highestSalary || 0) / 100000).toFixed(1)}L</p>
                        <p className="text-white/40 text-xs mt-1">Highest Package</p>
                    </div>
                </div>

                {branchData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={branchData} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="branch" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#1a1c2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                            <Bar dataKey="placed" fill="#10b981" radius={[6, 6, 0, 0]} name="Placed" />
                            <Bar dataKey="total" fill="rgba(255,255,255,0.1)" radius={[6, 6, 0, 0]} name="Total" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-white/30 text-sm text-center py-8">No branch data available yet</p>
                )}
            </motion.div>

            {/* Branch Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-white/5">
                    <h3 className="text-white font-semibold">Branch-wise Report</h3>
                </div>
                {branchData.length > 0 ? (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white/30 text-xs border-b border-white/5">
                                <th className="text-left p-4 font-medium">Branch</th>
                                <th className="text-left p-4 font-medium">Total</th>
                                <th className="text-left p-4 font-medium">Placed</th>
                                <th className="text-left p-4 font-medium">Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branchData.map(b => (
                                <tr key={b.branch} className="border-b border-white/5 last:border-0">
                                    <td className="p-4 text-white font-medium">{b.branch}</td>
                                    <td className="p-4 text-white/50">{b.total}</td>
                                    <td className="p-4 text-emerald-400">{b.placed}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${b.rate}%` }}></div>
                                            </div>
                                            <span className="text-white/40 text-xs">{b.rate}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-white/30">No data available for reports</div>
                )}
            </motion.div>
        </div>
    );
}
