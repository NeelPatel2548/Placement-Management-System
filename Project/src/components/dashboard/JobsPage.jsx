import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiLocationMarker, HiClock, HiCurrencyRupee, HiCheckCircle, HiX } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedJob, setSelectedJob] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState(new Set());
    const [applyLoading, setApplyLoading] = useState(null);

    const fetchJobs = useCallback(async () => {
        try {
            setError(null);
            const [jobsRes, appsRes] = await Promise.all([
                api.get('/api/student/jobs'),
                api.get('/api/student/applications').catch(() => ({ data: { applications: [] } })),
            ]);
            setJobs(jobsRes.data.jobs || []);

            // Track already-applied jobs
            const applied = new Set();
            (appsRes.data.applications || []).forEach(app => {
                const jobId = app.jobId?._id || app.jobId;
                if (jobId) applied.add(jobId);
            });
            setAppliedJobs(applied);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load jobs');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleApply = async (jobId, e) => {
        if (e) e.stopPropagation();
        setApplyLoading(jobId);
        try {
            await api.post(`/api/student/jobs/${jobId}/apply`);
            setAppliedJobs(prev => new Set([...prev, jobId]));
            window.dispatchEvent(new CustomEvent('pms:data-changed'));
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to apply';
            alert(msg);
        } finally {
            setApplyLoading(null);
        }
    };

    const filtered = jobs.filter(j => {
        const matchesSearch = (j.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (j.companyName || '').toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || j.jobType === typeFilter;
        return matchesSearch && matchesType;
    });

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
                <button onClick={fetchJobs} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Job Listings</h1>
                <p className="text-white/40 text-sm mt-1">Browse and apply to available positions ({jobs.length} jobs available)</p>
            </motion.div>

            {/* Search & Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-[#0f1120] border border-white/10 rounded-xl px-4 py-2.5 flex-1">
                    <HiSearch className="w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <HiFilter className="w-4 h-4 text-white/30" />
                    <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
                        className="px-3 py-2.5 bg-[#0f1120] border border-white/10 rounded-xl text-white text-sm focus:outline-none">
                        <option value="all">All Types</option>
                        <option value="fulltime">Full Time</option>
                        <option value="internship">Internship</option>
                    </select>
                </div>
            </motion.div>

            {/* Job Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <HiSearch className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">No jobs found matching your criteria. Check back soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((job, i) => {
                        const isApplied = appliedJobs.has(job._id);
                        return (
                            <motion.div key={job._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * Math.min(i, 10) }}
                                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5 transition-all group cursor-pointer"
                                onClick={() => setSelectedJob(job)}>
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 font-bold text-sm shrink-0">
                                        {(job.companyName || job.title || '?')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold truncate">{job.title}</h3>
                                        <p className="text-white/50 text-sm">{job.companyName || 'Company'}</p>
                                    </div>
                                    {isApplied && <HiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" title="Applied" />}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs"><HiLocationMarker className="w-3 h-3" />{job.location || 'Remote'}</span>
                                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                                        <HiCurrencyRupee className="w-3 h-3" />{job.package || job.salary ? `${job.package || job.salary} LPA` : 'Competitive'}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">
                                        {job.jobType === 'fulltime' ? 'Full Time' : job.jobType === 'internship' ? 'Internship' : job.jobType}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-white/30 text-[11px]">
                                        <HiClock className="w-3 h-3" />
                                        {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : 'Open'}
                                    </span>
                                    {isApplied ? (
                                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">Applied ✓</span>
                                    ) : (
                                        <button
                                            className="px-4 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-semibold hover:bg-primary-500/30 transition-colors flex items-center gap-1"
                                            disabled={applyLoading === job._id}
                                            onClick={e => handleApply(job._id, e)}>
                                            {applyLoading === job._id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply Now'}
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
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
                                <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 font-bold text-lg">
                                    {(selectedJob.companyName || selectedJob.title || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">{selectedJob.title}</h2>
                                    <p className="text-white/50 text-sm">{selectedJob.companyName || 'Company'}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="text-white/30 hover:text-white/80"><HiX className="w-5 h-5" /></button>
                        </div>
                        {selectedJob.description && (
                            <p className="text-white/50 text-sm mb-4">{selectedJob.description}</p>
                        )}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-white/40">Salary</span><span className="text-emerald-400 font-semibold">{selectedJob.package || selectedJob.salary ? `${selectedJob.package || selectedJob.salary} LPA` : 'Competitive'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Location</span><span className="text-white/80">{selectedJob.location || 'Remote'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Type</span><span className="text-white/80">{selectedJob.jobType === 'fulltime' ? 'Full Time' : 'Internship'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Deadline</span><span className="text-white/80">{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : 'Open'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Min CGPA</span><span className="text-white/80">{selectedJob.eligibilityCgpa || selectedJob.minCGPA || 'N/A'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Branches</span><span className="text-white/80">{selectedJob.eligibleBranches?.join(', ') || 'All'}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Openings</span><span className="text-white/80">{selectedJob.openings || 'N/A'}</span></div>
                        </div>
                        {selectedJob.requiredSkills?.length > 0 && (
                            <div className="mt-4">
                                <p className="text-white/40 text-xs mb-2">Required Skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedJob.requiredSkills.map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs">{s}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        {appliedJobs.has(selectedJob._id) ? (
                            <div className="mt-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center font-medium">
                                ✓ You have already applied for this position
                            </div>
                        ) : (
                            <button
                                className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                disabled={applyLoading === selectedJob._id}
                                onClick={() => handleApply(selectedJob._id)}>
                                {applyLoading === selectedJob._id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Now'}
                            </button>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
