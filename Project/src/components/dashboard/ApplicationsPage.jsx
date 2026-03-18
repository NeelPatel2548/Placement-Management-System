import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

const statusConfig = {
    applied: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-400' },
    shortlisted: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
    interview: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-400' },
    selected: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    hired: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
    rejected: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
};

const labelMap = { applied: 'Applied', shortlisted: 'Shortlisted', interview: 'Interview Scheduled', selected: 'Selected', hired: 'Hired', rejected: 'Rejected' };

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchApplications = useCallback(async () => {
        try {
            setError(null);
            const res = await api.get('/api/student/applications');
            setApplications(res.data.applications || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

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
                <button onClick={fetchApplications} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

    const filtered = statusFilter === 'all' ? applications : applications.filter(a => a.status === statusFilter);

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">My Applications</h1>
                <p className="text-white/40 text-sm mt-1">Track the status of your job applications ({applications.length} total)</p>
            </motion.div>

            {/* Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {Object.entries(statusConfig).filter(([key]) => key !== 'hired').map(([key, cfg]) => {
                    const count = applications.filter(a => a.status === key).length;
                    return (
                        <button key={key} onClick={() => setStatusFilter(statusFilter === key ? 'all' : key)}
                            className={`${cfg.bg} border ${cfg.border} rounded-xl p-3 text-center transition-all ${statusFilter === key ? 'ring-2 ring-white/20' : 'hover:border-white/20'}`}>
                            <p className={`text-2xl font-bold ${cfg.text}`}>{count}</p>
                            <p className="text-white/40 text-xs mt-0.5">{labelMap[key]}</p>
                        </button>
                    );
                })}
            </motion.div>

            {/* Table */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-white/40 text-sm">{applications.length === 0 ? 'No applications yet. Start applying to jobs!' : 'No applications matching this filter.'}</p>
                </div>
            ) : (
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
                                {filtered.map((app, i) => {
                                    const cfg = statusConfig[app.status] || statusConfig.applied;
                                    return (
                                        <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * Math.min(i, 10) }}
                                            className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                            <td className="px-5 py-4 text-white font-medium">{app.companyName || app.jobId?.companyName || 'N/A'}</td>
                                            <td className="px-5 py-4 text-white/60">{app.jobTitle || app.jobId?.title || 'N/A'}</td>
                                            <td className="px-5 py-4 text-white/40">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
                                                    {labelMap[app.status] || app.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
