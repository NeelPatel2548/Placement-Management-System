import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiUsers, HiSearch, HiFilter, HiCheck, HiX, HiCalendar } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';
import { useRefreshOnChange } from '../../hooks/useRefreshOnChange';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    shortlisted: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function CompanyApplicants() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionError, setActionError] = useState(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobFilter, setJobFilter] = useState('all');
    const [actionLoading, setActionLoading] = useState(null);

    // Interview modal state
    const [modal, setModal] = useState(null);
    const [interviewForm, setInterviewForm] = useState({ interviewDate: '', interviewType: 'online', meetingLink: '', location: '' });

    const fetchApplications = useCallback(async () => {
        try {
            setError(null);
            const res = await api.get('/api/company/applications');
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

    useRefreshOnChange(fetchApplications);

    const handleShortlist = async (appId) => {
        setActionLoading(appId);
        setActionError(null);
        try {
            await api.put(`/api/company/applications/${appId}/shortlist`);
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: 'shortlisted' } : a));
            window.dispatchEvent(new CustomEvent('pms:data-changed'));
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to shortlist');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (appId) => {
        setActionLoading(appId);
        setActionError(null);
        try {
            await api.put(`/api/company/applications/${appId}/reject`);
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: 'rejected' } : a));
            window.dispatchEvent(new CustomEvent('pms:data-changed'));
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to reject');
        } finally {
            setActionLoading(null);
        }
    };

    const openInterviewModal = (appId) => {
        setInterviewForm({ interviewDate: '', interviewType: 'online', meetingLink: '', location: '' });
        setModal(appId);
        setActionError(null);
    };

    const handleScheduleInterview = async () => {
        if (!interviewForm.interviewDate || !interviewForm.interviewType) {
            setActionError('Date and type are required');
            return;
        }
        setActionLoading(modal);
        setActionError(null);
        try {
            await api.post(`/api/company/applications/${modal}/interview`, interviewForm);
            setModal(null);
            window.dispatchEvent(new CustomEvent('pms:data-changed'));
            fetchApplications();
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to schedule interview');
        } finally {
            setActionLoading(null);
        }
    };

    // Extract unique job titles for filter
    const jobTitles = [...new Set(applications.map(a => a.jobId?.title).filter(Boolean))];

    const filtered = applications.filter(app => {
        const studentName = app.studentId?.userId?.name || app.studentId?.enrollmentNo || '';
        const studentEmail = app.studentId?.userId?.email || '';
        const matchesSearch = studentName.toLowerCase().includes(search.toLowerCase()) ||
            studentEmail.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
        const matchesJob = jobFilter === 'all' || app.jobId?.title === jobFilter;
        return matchesSearch && matchesStatus && matchesJob;
    });

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all';

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

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Applicants</h1>
                <p className="text-white/40 text-sm mt-1">Manage applications ({applications.length} total)</p>
            </motion.div>

            {/* Action Error */}
            {actionError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
                    <span>{actionError}</span>
                    <button onClick={() => setActionError(null)} className="text-red-400 hover:text-red-300"><HiX className="w-4 h-4" /></button>
                </motion.div>
            )}

            {/* Search & Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-[#0f1120] border border-white/10 rounded-xl px-4 py-2.5 flex-1">
                    <HiSearch className="w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <HiFilter className="w-4 h-4 text-white/30" />
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="px-3 py-2.5 bg-[#0f1120] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                        <option value="all">All Status</option>
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                        <option value="selected">Selected</option>
                    </select>
                    <select value={jobFilter} onChange={e => setJobFilter(e.target.value)}
                        className="px-3 py-2.5 bg-[#0f1120] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                        <option value="all">All Jobs</option>
                        {jobTitles.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </motion.div>

            {/* Applicant Table */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <HiUsers className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No applications found.</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-white/30 text-xs border-b border-white/5">
                                    <th className="text-left px-5 py-3 font-medium">Student</th>
                                    <th className="text-left px-5 py-3 font-medium">Job</th>
                                    <th className="text-left px-5 py-3 font-medium">CGPA</th>
                                    <th className="text-left px-5 py-3 font-medium">Branch</th>
                                    <th className="text-left px-5 py-3 font-medium">Status</th>
                                    <th className="text-left px-5 py-3 font-medium">Applied</th>
                                    <th className="text-right px-5 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((app, i) => (
                                    <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.02 * Math.min(i, 20) }}
                                        className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="text-white/80 font-medium">{app.studentId?.userId?.name || app.studentId?.enrollmentNo || 'N/A'}</p>
                                            <p className="text-white/30 text-xs">{app.studentId?.userId?.email || ''}</p>
                                        </td>
                                        <td className="px-5 py-4 text-white/60">{app.jobId?.title || 'N/A'}</td>
                                        <td className="px-5 py-4 text-white/60">{app.studentId?.cgpa || '—'}</td>
                                        <td className="px-5 py-4 text-white/60">{app.studentId?.branch || '—'}</td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status] || 'bg-gray-500/15 text-gray-400'}`}>
                                                {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : '—'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-white/40 text-xs">
                                            {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {(app.status === 'applied' || app.status === 'pending') && (
                                                    <>
                                                        <button onClick={() => handleShortlist(app._id)} disabled={actionLoading === app._id}
                                                            className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-colors disabled:opacity-50 flex items-center gap-1">
                                                            {actionLoading === app._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <HiCheck className="w-3 h-3" />}
                                                            Shortlist
                                                        </button>
                                                        <button onClick={() => handleReject(app._id)} disabled={actionLoading === app._id}
                                                            className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors disabled:opacity-50 flex items-center gap-1">
                                                            <HiX className="w-3 h-3" /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {app.status === 'shortlisted' && (
                                                    <>
                                                        <button onClick={() => openInterviewModal(app._id)}
                                                            className="px-3 py-1.5 rounded-lg bg-purple-500/15 text-purple-400 text-xs font-medium hover:bg-purple-500/25 transition-colors flex items-center gap-1">
                                                            <HiCalendar className="w-3 h-3" /> Schedule Interview
                                                        </button>
                                                        <button onClick={() => handleReject(app._id)} disabled={actionLoading === app._id}
                                                            className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-400 text-xs font-medium hover:bg-red-500/25 transition-colors disabled:opacity-50 flex items-center gap-1">
                                                            <HiX className="w-3 h-3" /> Reject
                                                        </button>
                                                    </>
                                                )}
                                                {app.status === 'selected' && (
                                                    <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">✓ Selected</span>
                                                )}
                                                {app.status === 'rejected' && (
                                                    <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400/60 text-xs">Rejected</span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Interview Scheduling Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setModal(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0f1120] border border-white/10 rounded-2xl p-6 w-full max-w-md"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white">Schedule Interview</h2>
                            <button onClick={() => setModal(null)} className="text-white/30 hover:text-white/80"><HiX className="w-5 h-5" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-1.5">Interview Date & Time *</label>
                                <input type="datetime-local" value={interviewForm.interviewDate}
                                    onChange={e => setInterviewForm(f => ({ ...f, interviewDate: e.target.value }))}
                                    className={inputClass} required />
                            </div>
                            <div>
                                <label className="block text-white/60 text-sm font-medium mb-1.5">Mode *</label>
                                <select value={interviewForm.interviewType}
                                    onChange={e => setInterviewForm(f => ({ ...f, interviewType: e.target.value }))}
                                    className={inputClass}>
                                    <option value="online" className="bg-[#0f1120]">Online</option>
                                    <option value="offline" className="bg-[#0f1120]">Offline</option>
                                </select>
                            </div>
                            {interviewForm.interviewType === 'online' && (
                                <div>
                                    <label className="block text-white/60 text-sm font-medium mb-1.5">Meeting Link</label>
                                    <input type="url" placeholder="https://meet.google.com/..." value={interviewForm.meetingLink}
                                        onChange={e => setInterviewForm(f => ({ ...f, meetingLink: e.target.value }))}
                                        className={inputClass} />
                                </div>
                            )}
                            {interviewForm.interviewType === 'offline' && (
                                <div>
                                    <label className="block text-white/60 text-sm font-medium mb-1.5">Venue / Location</label>
                                    <input type="text" placeholder="Room 301, Placement Cell" value={interviewForm.location}
                                        onChange={e => setInterviewForm(f => ({ ...f, location: e.target.value }))}
                                        className={inputClass} />
                                </div>
                            )}
                        </div>

                        {actionError && (
                            <p className="mt-4 text-red-400 text-sm">{actionError}</p>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setModal(null)}
                                className="px-4 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleScheduleInterview} disabled={actionLoading === modal}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center gap-2">
                                {actionLoading === modal ? <Loader2 className="w-4 h-4 animate-spin" /> : <HiCalendar className="w-4 h-4" />}
                                Schedule
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
