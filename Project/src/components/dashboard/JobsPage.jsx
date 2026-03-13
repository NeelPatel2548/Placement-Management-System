import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiLocationMarker, HiClock, HiCurrencyRupee, HiCheckCircle, HiX } from 'react-icons/hi';
import api from '../../services/api';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyingId, setApplyingId] = useState(null);
    const [applyMsg, setApplyMsg] = useState({ type: '', text: '' });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/student/jobs');
                setJobs(res.data.jobs || []);
            } catch (err) {
                setError('Failed to load jobs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const handleApply = async (jobId, e) => {
        if (e) e.stopPropagation();
        try {
            setApplyingId(jobId);
            setApplyMsg({ type: '', text: '' });
            await api.post(`/api/student/jobs/${jobId}/apply`);
            setApplyMsg({ type: 'success', text: 'Application submitted successfully!' });
            setTimeout(() => setApplyMsg({ type: '', text: '' }), 3000);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply';
            setApplyMsg({ type: 'error', text: msg });
            setTimeout(() => setApplyMsg({ type: '', text: '' }), 3000);
        } finally {
            setApplyingId(null);
        }
    };

    const filtered = jobs.filter(j => {
        const title = j.title || '';
        const company = j.companyId?.companyName || j.companyName || '';
        return title.toLowerCase().includes(search.toLowerCase()) || company.toLowerCase().includes(search.toLowerCase());
    });

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

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Job Listings</h1>
                <p className="text-white/40 text-sm mt-1">Browse and apply to available positions</p>
            </motion.div>

            {/* Apply feedback */}
            {applyMsg.text && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-xl text-sm text-center border ${applyMsg.type === 'success' ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' : 'bg-red-500/15 border-red-500/20 text-red-400'}`}>
                    {applyMsg.text}
                </motion.div>
            )}

            {/* Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-[#0f1120] border border-white/10 rounded-xl px-4 py-2.5 flex-1">
                    <HiSearch className="w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none w-full" />
                </div>
            </motion.div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((job, i) => (
                    <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5 transition-all group cursor-pointer"
                        onClick={() => setSelectedJob(job)}>
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-3xl">💼</span>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold truncate">{job.title}</h3>
                                <p className="text-white/50 text-sm">{job.companyId?.companyName || job.companyName || 'Company'}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs"><HiLocationMarker className="w-3 h-3" />{job.location || 'Remote'}</span>
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold"><HiCurrencyRupee className="w-3 h-3" />{job.salary || job.package ? `${job.salary || job.package} LPA` : '—'}</span>
                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">{job.jobType === 'internship' ? 'Internship' : 'Full Time'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-white/30 text-[11px]"><HiClock className="w-3 h-3" />Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</span>
                            <button className="px-4 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-semibold hover:bg-primary-500/30 transition-colors"
                                disabled={applyingId === job._id}
                                onClick={e => handleApply(job._id, e)}>
                                {applyingId === job._id ? 'Applying...' : 'Apply Now'}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <HiSearch className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No jobs found matching your criteria</p>
                </div>
            )}

            {/* Job Detail Modal */}
            {selectedJob && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedJob(null)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0f1120] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}>
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">💼</span>
                                <div>
                                    <h2 className="text-lg font-bold text-white">{selectedJob.title}</h2>
                                    <p className="text-white/50 text-sm">{selectedJob.companyId?.companyName || selectedJob.companyName || 'Company'}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="text-white/30 hover:text-white/80"><HiX className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-white/40">Salary</span><span className="text-emerald-400 font-semibold">{selectedJob.salary || selectedJob.package ? `${selectedJob.salary || selectedJob.package} LPA` : '—'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Location</span><span className="text-white/80">{selectedJob.location || 'Remote'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Type</span><span className="text-white/80">{selectedJob.jobType === 'internship' ? 'Internship' : 'Full Time'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Deadline</span><span className="text-white/80">{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : '—'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Min CGPA</span><span className="text-white/80">{selectedJob.eligibilityCgpa || selectedJob.minCGPA || '—'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Branches</span><span className="text-white/80">{(selectedJob.eligibleBranches || []).join(', ') || 'All'}</span></div>
                            {selectedJob.description && (
                                <div className="pt-2 border-t border-white/5">
                                    <p className="text-white/40 mb-1">Description</p>
                                    <p className="text-white/70 text-sm leading-relaxed">{selectedJob.description}</p>
                                </div>
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            disabled={applyingId === selectedJob._id}
                            onClick={() => handleApply(selectedJob._id)}>
                            {applyingId === selectedJob._id ? 'Applying...' : 'Apply Now'}
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
