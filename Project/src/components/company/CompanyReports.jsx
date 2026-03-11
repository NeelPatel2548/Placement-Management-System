import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, DollarSign, TrendingUp, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../services/api';

const barColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4'];

export default function CompanyReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/api/placementreports');
                setReports(res.data.reports || []);
            } catch (err) {
                console.error('Fetch reports error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    }

    // Aggregate stats across all reports
    const totalApplications = reports.reduce((sum, r) => sum + (r.totalApplications || 0), 0);
    const totalHired = reports.reduce((sum, r) => sum + (r.totalHired || 0), 0);
    const avgPackage = reports.length > 0 ? reports.reduce((sum, r) => sum + (r.averagePackage || 0), 0) / reports.length : 0;
    const highestPackage = Math.max(...reports.map(r => r.highestPackage || 0), 0);

    // Merge branchWiseHiring from all reports
    const branchData = {};
    reports.forEach(r => {
        if (r.branchWiseHiring) {
            Object.entries(r.branchWiseHiring).forEach(([branch, count]) => {
                branchData[branch] = (branchData[branch] || 0) + count;
            });
        }
    });
    const chartData = Object.entries(branchData).map(([name, value]) => ({ name, value }));

    const statCards = [
        { label: 'Total Applications', value: totalApplications, icon: Users, gradient: 'from-blue-500 to-blue-600' },
        { label: 'Total Hired', value: totalHired, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-500' },
        { label: 'Avg Package', value: `₹${(avgPackage / 100000).toFixed(1)}L`, icon: DollarSign, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Highest Package', value: `₹${(highestPackage / 100000).toFixed(1)}L`, icon: BarChart3, gradient: 'from-purple-500 to-violet-600' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Reports</h1>
                <p className="text-white/40 text-sm">Placement analytics and hiring insights</p>
            </div>

            {reports.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <BarChart3 className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No reports available</p>
                </div>
            ) : (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((s, i) => (
                            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-[#111827] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-2xl font-bold text-white">{s.value}</p>
                                        <p className="text-white/40 text-xs mt-1">{s.label}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                                        <s.icon className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bar Chart */}
                    {chartData.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-[#111827] border border-white/5 rounded-2xl p-6">
                            <h2 className="text-white font-semibold mb-6">Branch-wise Hiring</h2>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} allowDecimals={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '13px' }}
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                        />
                                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                            {chartData.map((_, idx) => (
                                                <Cell key={idx} fill={barColors[idx % barColors.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </div>
    );
}
