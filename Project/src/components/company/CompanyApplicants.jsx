import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, UserCheck, CalendarDays, XCircle, Loader2, FileText } from 'lucide-react';
import api from '../../services/api';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    hired: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const statusOptions = ['all', 'applied', 'shortlisted', 'interview', 'hired', 'rejected'];

export default function CompanyApplicants() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchApplications();
    }, [filter]);

    const fetchApplications = async () => {
        try {
            const params = filter !== 'all' ? `?status=${filter}` : '';
            const res = await api.get(`/api/applications${params}`);
            setApplications(res.data.applications || []);
        } catch (err) {
            console.error('Fetch applications error:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status, extras = {}) => {
        setActionLoading(id);
        try {
            await api.patch(`/api/applications/${id}`, { status, ...extras });
            fetchApplications();
        } catch (err) {
            console.error('Update application error:', err);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Applications</h1>
                    <p className="text-white/40 text-sm">Review and manage student applications</p>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-white/30" />
                    <select value={filter} onChange={e => setFilter(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors">
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Applications Table */}
            {applications.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <FileText className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No applications found</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-white/30 text-xs border-b border-white/5 bg-white/[0.02]">
                                    <th className="text-left p-4 font-medium">Student Name</th>
                                    <th className="text-left p-4 font-medium">Job Title</th>
                                    <th className="text-left p-4 font-medium">Applied Date</th>
                                    <th className="text-left p-4 font-medium">Status</th>
                                    <th className="text-left p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map(app => (
                                    <tr key={app._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-white/80 font-medium">{app.studentName || 'N/A'}</td>
                                        <td className="p-4 text-white/50">{app.jobTitle || 'N/A'}</td>
                                        <td className="p-4 text-white/40 text-xs">{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status] || 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
                                                {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : '—'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1.5">
                                                {app.status === 'applied' && (
                                                    <>
                                                        <button onClick={() => updateStatus(app._id, 'shortlisted', { currentRound: 'Shortlisted' })}
                                                            disabled={actionLoading === app._id}
                                                            className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-400 text-[11px] font-medium hover:bg-amber-500/25 transition-colors flex items-center gap-1">
                                                            <UserCheck className="w-3 h-3" /> Shortlist
                                                        </button>
                                                        <button onClick={() => updateStatus(app._id, 'rejected', { remarks: 'Not suitable' })}
                                                            disabled={actionLoading === app._id}
                                                            className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-[11px] font-medium hover:bg-red-500/25 transition-colors flex items-center gap-1">
                                                            <XCircle className="w-3 h-3" /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {app.status === 'shortlisted' && (
                                                    <button onClick={() => updateStatus(app._id, 'interview', { currentRound: 'Interview Scheduled' })}
                                                        disabled={actionLoading === app._id}
                                                        className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-400 text-[11px] font-medium hover:bg-purple-500/25 transition-colors flex items-center gap-1">
                                                        <CalendarDays className="w-3 h-3" /> Schedule Interview
                                                    </button>
                                                )}
                                                {actionLoading === app._id && <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
