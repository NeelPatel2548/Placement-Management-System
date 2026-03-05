import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiLocationMarker, HiClock, HiCurrencyRupee, HiCheckCircle, HiX } from 'react-icons/hi';
import { mockJobs, mockStudent } from './mockData';

export default function JobsPage() {
    const [search, setSearch] = useState('');
    const [showEligible, setShowEligible] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const filtered = mockJobs.filter(j => {
        const matchesSearch = j.company.toLowerCase().includes(search.toLowerCase()) || j.role.toLowerCase().includes(search.toLowerCase());
        const isEligible = mockStudent.cgpa >= j.eligibilityCgpa && j.eligibleBranches.includes(mockStudent.branch);
        return matchesSearch && (showEligible ? isEligible : true);
    });

    const isEligible = (job) => mockStudent.cgpa >= job.eligibilityCgpa && job.eligibleBranches.includes(mockStudent.branch);

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Job Listings</h1>
                <p className="text-white/40 text-sm mt-1">Browse and apply to available positions</p>
            </motion.div>

            {/* Search & Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-2 bg-[#0f1120] border border-white/10 rounded-xl px-4 py-2.5 flex-1">
                    <HiSearch className="w-4 h-4 text-white/30" />
                    <input type="text" placeholder="Search jobs or companies..." value={search} onChange={e => setSearch(e.target.value)}
                        className="bg-transparent text-sm text-white placeholder-white/30 focus:outline-none w-full" />
                </div>
                <button onClick={() => setShowEligible(!showEligible)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showEligible ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-[#0f1120] border border-white/10 text-white/50 hover:text-white/80'
                        }`}>
                    <HiFilter className="w-4 h-4" /> Eligible Only
                </button>
            </motion.div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((job, i) => (
                    <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5 transition-all group cursor-pointer"
                        onClick={() => setSelectedJob(job)}>
                        <div className="flex items-start gap-3 mb-4">
                            <span className="text-3xl">{job.logo}</span>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold truncate">{job.role}</h3>
                                <p className="text-white/50 text-sm">{job.company}</p>
                            </div>
                            {isEligible(job) && <HiCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" title="Eligible" />}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-white/40 text-xs"><HiLocationMarker className="w-3 h-3" />{job.location}</span>
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold"><HiCurrencyRupee className="w-3 h-3" />{job.salary}</span>
                            <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">{job.type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1 text-white/30 text-[11px]"><HiClock className="w-3 h-3" />Deadline: {job.deadline}</span>
                            {isEligible(job) ? (
                                <button className="px-4 py-1.5 rounded-lg bg-primary-500/20 text-primary-400 text-xs font-semibold hover:bg-primary-500/30 transition-colors"
                                    onClick={e => { e.stopPropagation(); }}>Apply Now</button>
                            ) : (
                                <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400/60 text-xs">Not Eligible</span>
                            )}
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
                                <span className="text-4xl">{selectedJob.logo}</span>
                                <div>
                                    <h2 className="text-lg font-bold text-white">{selectedJob.role}</h2>
                                    <p className="text-white/50 text-sm">{selectedJob.company}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedJob(null)} className="text-white/30 hover:text-white/80"><HiX className="w-5 h-5" /></button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-white/40">Salary</span><span className="text-emerald-400 font-semibold">{selectedJob.salary}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Location</span><span className="text-white/80">{selectedJob.location}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Type</span><span className="text-white/80">{selectedJob.type}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Deadline</span><span className="text-white/80">{selectedJob.deadline}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Min CGPA</span><span className="text-white/80">{selectedJob.eligibilityCgpa}</span></div>
                            <div className="flex justify-between"><span className="text-white/40">Branches</span><span className="text-white/80">{selectedJob.eligibleBranches.join(', ')}</span></div>
                        </div>
                        {isEligible(selectedJob) ? (
                            <button className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                Apply Now
                            </button>
                        ) : (
                            <div className="mt-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                You are not eligible for this position
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
