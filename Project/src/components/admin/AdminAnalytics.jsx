import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { adminAnalyticsData, adminMockStats } from './adminMockData';

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalytics() {
    const metrics = [
        { label: 'Placement Rate', value: `${adminAnalyticsData.placementPercentage}%`, color: 'rose', icon: '📊' },
        { label: 'Average Package', value: `₹${(adminAnalyticsData.averageSalary / 100000).toFixed(1)} LPA`, color: 'emerald', icon: '💰' },
        { label: 'Highest Package', value: `₹${(adminAnalyticsData.highestSalary / 100000).toFixed(1)} LPA`, color: 'amber', icon: '🏆' },
        { label: 'Total Placed', value: adminMockStats.totalPlacements, color: 'indigo', icon: '🎯' },
    ];

    const tooltipStyle = { background: '#1a1c2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' };
    const tickStyle = { fill: 'rgba(255,255,255,0.4)', fontSize: 12 };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Placement Analytics</h1>
                <p className="text-white/40 text-sm mt-1">Comprehensive placement statistics</p>
            </motion.div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                    <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                        <span className="text-2xl">{m.icon}</span>
                        <p className="text-2xl font-bold text-white mt-2">{m.value}</p>
                        <p className="text-white/40 text-sm mt-0.5">{m.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Branch-wise Bar */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Branch-wise Stats</h2>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={adminAnalyticsData.branchWise.map(b => ({ branch: b.branch, Placed: b.placed, Total: b.total }))} barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="branch" tick={tickStyle} axisLine={false} tickLine={false} />
                            <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Bar dataKey="Total" fill="rgba(255,255,255,0.1)" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="Placed" fill="#6366f1" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Company Pie */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Company-wise Hiring</h2>
                    <div className="flex items-center">
                        <ResponsiveContainer width="55%" height={240}>
                            <PieChart>
                                <Pie data={adminAnalyticsData.companyWise.map(c => ({ name: c.company, value: c.hires }))}
                                    cx="50%" cy="50%" outerRadius={85} innerRadius={48} dataKey="value" paddingAngle={3}>
                                    {adminAnalyticsData.companyWise.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={tooltipStyle} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex-1 space-y-2.5">
                            {adminAnalyticsData.companyWise.map((c, i) => (
                                <div key={c.company} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }}></span>
                                        <span className="text-white/60">{c.company}</span>
                                    </div>
                                    <span className="text-white font-semibold">{c.hires}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Trend */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Placement Trend</h2>
                <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={adminAnalyticsData.monthlyPlacements}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
                        <YAxis tick={tickStyle} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <defs>
                            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="placements" stroke="#f43f5e" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#f43f5e', r: 4 }} />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
}
