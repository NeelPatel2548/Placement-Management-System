import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Calendar, Briefcase, Users, Loader2, X } from 'lucide-react';
import api from '../../services/api';

const branchOptions = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'];

export default function CompanyJobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', location: '', package: '', jobType: 'fulltime',
        minCGPA: '', eligibleBranches: [], requiredSkills: '', openings: '', deadline: '',
        companyId: '', companyName: '',
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/api/jobs');
            setJobs(res.data.jobs || []);
        } catch (err) {
            console.error('Fetch jobs error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/api/jobs', {
                ...form,
                requiredSkills: form.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
                package: Number(form.package),
                minCGPA: Number(form.minCGPA),
                openings: Number(form.openings),
            });
            setShowModal(false);
            setForm({ title: '', description: '', location: '', package: '', jobType: 'fulltime', minCGPA: '', eligibleBranches: [], requiredSkills: '', openings: '', deadline: '', companyId: '', companyName: '' });
            fetchJobs();
        } catch (err) {
            console.error('Post job error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleBranch = (b) => {
        setForm(prev => ({
            ...prev,
            eligibleBranches: prev.eligibleBranches.includes(b)
                ? prev.eligibleBranches.filter(x => x !== b)
                : [...prev.eligibleBranches, b],
        }));
    };

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Jobs</h1>
                    <p className="text-white/40 text-sm">Manage your job postings</p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/20">
                    <Plus className="w-4 h-4" /> Post New Job
                </button>
            </div>

            {/* Jobs Table */}
            {jobs.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <Briefcase className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No jobs posted yet</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-white/30 text-xs border-b border-white/5 bg-white/[0.02]">
                                    <th className="text-left p-4 font-medium">Title</th>
                                    <th className="text-left p-4 font-medium">Package (LPA)</th>
                                    <th className="text-left p-4 font-medium">Location</th>
                                    <th className="text-left p-4 font-medium">Deadline</th>
                                    <th className="text-left p-4 font-medium">Status</th>
                                    <th className="text-left p-4 font-medium">Openings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map(job => (
                                    <tr key={job._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4">
                                            <div>
                                                <p className="text-white/90 font-medium">{job.title}</p>
                                                <p className="text-white/30 text-xs mt-0.5">{job.companyName || '—'}</p>
                                            </div>
                                        </td>
                                        <td className="p-4 text-emerald-400 font-semibold">₹{((job.package || job.salary || 0) / 100000).toFixed(1)}</td>
                                        <td className="p-4 text-white/50 flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location || '—'}</td>
                                        <td className="p-4 text-white/40 text-xs">{job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${job.status === 'open' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-red-500/15 text-red-400 border-red-500/20'}`}>
                                                {job.status === 'open' ? 'Open' : 'Closed'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white/50">{job.openings || 1}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Post Job Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#111827] border border-white/10 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-white text-lg font-bold">Post New Job</h2>
                                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white/60"><X className="w-5 h-5" /></button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-white/50 text-xs font-medium block mb-1.5">Job Title *</label>
                                    <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs font-medium block mb-1.5">Description</label>
                                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-white/50 text-xs font-medium block mb-1.5">Package (₹)</label>
                                        <input type="number" value={form.package} onChange={e => setForm({ ...form, package: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs font-medium block mb-1.5">Location</label>
                                        <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-white/50 text-xs font-medium block mb-1.5">Job Type *</label>
                                        <select value={form.jobType} onChange={e => setForm({ ...form, jobType: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors">
                                            <option value="fulltime">Full Time</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs font-medium block mb-1.5">Min CGPA</label>
                                        <input type="number" step="0.1" value={form.minCGPA} onChange={e => setForm({ ...form, minCGPA: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-white/50 text-xs font-medium block mb-1.5">Openings</label>
                                        <input type="number" value={form.openings} onChange={e => setForm({ ...form, openings: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                    </div>
                                    <div>
                                        <label className="text-white/50 text-xs font-medium block mb-1.5">Deadline</label>
                                        <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                                            className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs font-medium block mb-1.5">Required Skills (comma separated)</label>
                                    <input value={form.requiredSkills} onChange={e => setForm({ ...form, requiredSkills: e.target.value })} placeholder="React, Node.js, MongoDB"
                                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                </div>
                                <div>
                                    <label className="text-white/50 text-xs font-medium block mb-2">Eligible Branches</label>
                                    <div className="flex flex-wrap gap-2">
                                        {branchOptions.map(b => (
                                            <button key={b} type="button" onClick={() => toggleBranch(b)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${form.eligibleBranches.includes(b) ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'}`}>
                                                {b}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit" disabled={submitting}
                                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</> : 'Post Job'}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
