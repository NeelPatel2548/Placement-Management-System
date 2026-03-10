import { motion } from 'framer-motion';
import { HiBriefcase, HiUsers, HiCalendar, HiStar, HiClock, HiLocationMarker, HiTrendingUp } from 'react-icons/hi';
import { companyMockStats, companyMockJobs, companyMockApplicants, companyMockInterviews } from './companyMockData';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const statCards = [
    { label: 'Active Jobs', value: companyMockStats.activeJobs, icon: HiBriefcase, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
    { label: 'Total Applicants', value: companyMockStats.totalApplicants, icon: HiUsers, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Interviews', value: companyMockStats.interviews, icon: HiCalendar, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
    { label: 'Selected', value: companyMockStats.selected, icon: HiStar, color: 'rose', gradient: 'from-rose-500 to-pink-500' },
];

export default function CompanyHome() {
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const recentApplicants = companyMockApplicants.slice(0, 5);
    const upcomingInterviews = companyMockInterviews.filter(i => i.status === 'scheduled');
    const activeJobs = companyMockJobs.filter(j => j.status === 'open');

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-emerald-600/20 via-teal-500/10 to-cyan-500/10 border border-emerald-500/10 rounded-2xl p-6">
                <h1 className="text-2xl font-bold text-white">Welcome, {user.name || 'Company'} 👋</h1>
                <p className="text-white/40 text-sm mt-1">Manage your recruitment drives and applicants</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-3xl font-bold text-white">{s.value}</p>
                                <p className="text-white/40 text-sm mt-1">{s.label}</p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Active Jobs + Upcoming Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Jobs */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-2 bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Active Job Postings</h2>
                        <a href="/company/post-job" className="text-emerald-400 text-xs font-medium hover:text-emerald-300">+ Post New</a>
                    </div>
                    <div className="space-y-3">
                        {activeJobs.map(job => (
                            <div key={job.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-emerald-500/20 transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-medium text-sm">{job.title}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-white/40">
                                            <span className="flex items-center gap-1"><HiLocationMarker className="w-3 h-3" />{job.location}</span>
                                            <span className="text-emerald-400 font-semibold">₹{(job.salary / 100000).toFixed(0)} LPA</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-semibold text-lg">{job.applicantCount}</p>
                                        <p className="text-white/30 text-[11px]">Applicants</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                                    <span className="flex items-center gap-1 text-[11px] text-white/30"><HiClock className="w-3 h-3" />Deadline: {job.deadline}</span>
                                    <a href="/company/applicants" className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-[11px] font-medium hover:bg-emerald-500/30 transition-colors">View Applicants</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Upcoming Interviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Upcoming Interviews</h2>
                    <div className="space-y-3">
                        {upcomingInterviews.length === 0 ? (
                            <p className="text-white/30 text-sm text-center py-6">No upcoming interviews</p>
                        ) : (
                            upcomingInterviews.map(iv => (
                                <div key={iv.id} className="bg-white/5 border border-white/5 rounded-xl p-4">
                                    <h3 className="text-white font-medium text-sm">{iv.candidateName}</h3>
                                    <p className="text-white/40 text-xs mt-0.5">{iv.jobTitle}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-white/30 text-[11px]">{iv.date} · {iv.time}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${iv.type === 'online' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                                            {iv.type === 'online' ? '🎥 Online' : '🏢 Offline'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Recent Applicants */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-white font-semibold">Recent Applicants</h2>
                    <a href="/company/applicants" className="text-emerald-400 text-xs font-medium hover:text-emerald-300">View All →</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-white/30 text-xs border-b border-white/5">
                                <th className="text-left pb-3 font-medium">Name</th>
                                <th className="text-left pb-3 font-medium">Branch</th>
                                <th className="text-left pb-3 font-medium">CGPA</th>
                                <th className="text-left pb-3 font-medium">Position</th>
                                <th className="text-left pb-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentApplicants.map(app => (
                                <tr key={app.id} className="border-b border-white/5 last:border-0">
                                    <td className="py-3 text-white/80 font-medium">{app.name}</td>
                                    <td className="py-3 text-white/50">{app.branch}</td>
                                    <td className="py-3 text-white/50">{app.cgpa}</td>
                                    <td className="py-3 text-white/50">{app.jobTitle}</td>
                                    <td className="py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status]}`}>
                                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
