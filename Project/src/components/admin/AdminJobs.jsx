import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiLocationMarker, HiClock, HiUsers } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function AdminJobs() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get('/api/admin/jobs');
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

    const filtered = jobs.filter(j => {
        const title = j.title || '';
        const company = j.companyId?.companyName || '';
        if (search && !title.toLowerCase().includes(search.toLowerCase()) && !company.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter !== 'all' && j.status !== statusFilter) return false;
        return true;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-red-400 text-sm mb-2">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Job Drives</h1>
                <p className="text-white/40 text-sm mt-1">Manage all active and past job postings</p>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs or companies..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500/50" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500/50">
                        <option value="all">All Status</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </motion.div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((job, i) => (
                    <motion.div key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-white font-semibold">{job.title}</h3>
                                <p className="text-white/40 text-sm mt-0.5">{job.companyId?.companyName || 'N/A'}</p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${job.status === 'open' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-red-500/15 text-red-400 border-red-500/20'}`}>
                                {job.status === 'open' ? '● Open' : '● Closed'}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-white/40">
                            <span className="flex items-center gap-1"><HiLocationMarker className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                            <span className="text-emerald-400 font-semibold">₹{job.salary ? (job.salary / 100000).toFixed(0) : '—'} LPA</span>
                            <span className="flex items-center gap-1"><HiUsers className="w-3.5 h-3.5" /> {job.applicantCount || 0} applicants</span>
                            <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" /> {job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            {filtered.length === 0 && (
                <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-8 text-center">
                    <p className="text-white/30">No jobs match the current filters</p>
                </div>
            )}
        </div>
    );
}
