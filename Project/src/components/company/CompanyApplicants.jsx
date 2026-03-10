import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiSearch, HiFilter, HiCheck, HiX, HiCalendar, HiMail, HiPhone } from 'react-icons/hi';
import { companyMockApplicants, companyMockJobs } from './companyMockData';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function CompanyApplicants() {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [minCgpa, setMinCgpa] = useState('');
    const [selectedJob, setSelectedJob] = useState('all');
    const [applicants, setApplicants] = useState(companyMockApplicants);
    const [expandedId, setExpandedId] = useState(null);

    const filtered = applicants.filter(a => {
        if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.email.toLowerCase().includes(search.toLowerCase())) return false;
        if (statusFilter !== 'all' && a.status !== statusFilter) return false;
        if (minCgpa && a.cgpa < parseFloat(minCgpa)) return false;
        if (selectedJob !== 'all' && a.jobTitle !== selectedJob) return false;
        return true;
    });

    const updateStatus = (id, status) => {
        setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Applicants</h1>
                <p className="text-white/40 text-sm mt-1">Manage and review candidates for your job postings</p>
            </motion.div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
                    </div>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                        <option value="all">All Statuses</option>
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="selected">Selected</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                        <option value="all">All Positions</option>
                        {companyMockJobs.map(j => <option key={j.id} value={j.title}>{j.title}</option>)}
                    </select>
                    <input value={minCgpa} onChange={e => setMinCgpa(e.target.value)} type="number" step="0.1" min="0" max="10"
                        placeholder="Min CGPA" className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
                </div>
                <p className="text-white/30 text-xs mt-3">{filtered.length} applicant{filtered.length !== 1 ? 's' : ''} found</p>
            </motion.div>

            {/* Applicant Cards */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="bg-[#0f1120] border border-white/5 rounded-2xl p-8 text-center">
                        <p className="text-white/30">No applicants match the current filters</p>
                    </div>
                ) : (
                    filtered.map((app, i) => (
                        <motion.div key={app.id}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-[#0f1120] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all">
                            <div className="p-5 cursor-pointer" onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-sm">
                                            {app.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium text-sm">{app.name}</h3>
                                            <p className="text-white/40 text-xs">{app.branch} · CGPA: {app.cgpa} · {app.jobTitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status]}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                        {(app.status === 'applied' || app.status === 'shortlisted') && (
                                            <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                                                <button onClick={() => updateStatus(app.id, 'shortlisted')} title="Shortlist"
                                                    className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/25 transition-colors">
                                                    <HiCheck className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => updateStatus(app.id, 'rejected')} title="Reject"
                                                    className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center hover:bg-red-500/25 transition-colors">
                                                    <HiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {expandedId === app.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                    className="px-5 pb-5 border-t border-white/5 pt-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-2 text-white/50 text-sm">
                                            <HiMail className="w-4 h-4" /> {app.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/50 text-sm">
                                            <HiPhone className="w-4 h-4" /> {app.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/50 text-sm">
                                            <HiCalendar className="w-4 h-4" /> Applied: {app.appliedDate}
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <p className="text-white/40 text-xs mb-2">Skills:</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {app.skills.map(skill => (
                                                <span key={skill} className="px-2.5 py-1 rounded-full bg-white/5 text-white/50 text-[11px] border border-white/10">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
