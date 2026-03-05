import { motion } from 'framer-motion';
import { mockApplications } from './mockData';

const statusConfig = {
    applied: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
    shortlisted: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    interview: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400' },
    selected: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    rejected: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
};

const labelMap = { applied: 'Applied', shortlisted: 'Shortlisted', interview: 'Interview Scheduled', selected: 'Selected', rejected: 'Rejected' };

export default function ApplicationsPage() {
    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">My Applications</h1>
                <p className="text-white/40 text-sm mt-1">Track the status of your job applications</p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(statusConfig).map(([key, cfg]) => {
                    const count = mockApplications.filter(a => a.status === key).length;
                    return (
                        <div key={key} className={`${cfg.bg} border ${cfg.border} rounded-xl p-3 text-center`}>
                            <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                            <p className="text-white/40 text-xs mt-0.5">{labelMap[key]}</p>
                        </div>
                    );
                })}
            </motion.div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white/30 text-xs border-b border-white/5 bg-white/[0.02]">
                                <th className="text-left px-5 py-3.5 font-medium">Company</th>
                                <th className="text-left px-5 py-3.5 font-medium">Role</th>
                                <th className="text-left px-5 py-3.5 font-medium">Applied Date</th>
                                <th className="text-left px-5 py-3.5 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockApplications.map((app, i) => {
                                const cfg = statusConfig[app.status];
                                return (
                                    <motion.tr key={app.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}
                                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4 text-white font-medium">{app.company}</td>
                                        <td className="px-5 py-4 text-white/60">{app.role}</td>
                                        <td className="px-5 py-4 text-white/40">{app.appliedDate}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                                                {labelMap[app.status]}
                                            </span>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {mockApplications.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-white/40 text-sm">No applications yet. Start applying to jobs!</p>
                </div>
            )}
        </div>
    );
}
