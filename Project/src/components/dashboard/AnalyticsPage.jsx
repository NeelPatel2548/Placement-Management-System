import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { mockAnalytics } from './mockData';

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
    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <p className="text-white/40 text-sm mt-1">Track your placement journey progress</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications vs Interviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-6">Applications vs Interviews</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={mockAnalytics.applicationsVsInterviews} barGap={6}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="applications" fill="#6366f1" radius={[6, 6, 0, 0]} name="Applications" />
                            <Bar dataKey="interviews" fill="#a855f7" radius={[6, 6, 0, 0]} name="Interviews" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Placement Progress */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-6">Placement Progress</h2>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={mockAnalytics.placementProgress} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                                dataKey="value" paddingAngle={4} labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {mockAnalytics.placementProgress.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Test Performance */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 lg:col-span-2">
                    <h2 className="text-white font-semibold mb-6">Test Performance</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={mockAnalytics.testPerformance}>
                            <PolarGrid stroke="rgba(255,255,255,0.08)" />
                            <PolarAngleAxis dataKey="test" stroke="rgba(255,255,255,0.4)" fontSize={12} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255,255,255,0.1)" fontSize={10} />
                            <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} name="Score" />
                            <Tooltip content={<CustomTooltip />} />
                        </RadarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>
        </div>
    );
}
