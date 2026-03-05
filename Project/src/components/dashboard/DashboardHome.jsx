import { motion } from 'framer-motion';
import { HiBriefcase, HiPaperAirplane, HiCalendar, HiStar, HiLocationMarker, HiClock, HiExternalLink } from 'react-icons/hi';
import StatsCard from './StatsCard';
import { mockUser, mockStudent, mockStats, mockJobs, mockApplications, mockInterviews, mockNotifications } from './mockData';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function DashboardHome() {
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const name = user.name || mockUser.name;

    // Profile completion
    const profilePercent = 85;

    // Eligible jobs (mock filter: cgpa >= job.eligibilityCgpa and branch in job.eligibleBranches)
    const eligibleJobs = mockJobs.filter(
        j => mockStudent.cgpa >= j.eligibilityCgpa && j.eligibleBranches.includes(mockStudent.branch)
    ).slice(0, 4);

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary-600/20 via-primary-500/10 to-accent-500/10 border border-primary-500/10 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Welcome back, {name} 👋</h1>
                        <p className="text-white/40 text-sm mt-1">Here's your placement dashboard overview</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${mockStudent.placementStatus === 'placed'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                            }`}>
                            {mockStudent.placementStatus === 'placed' ? '✓ Placed' : '○ Not Placed'}
                        </span>
                    </div>
                </div>
                {/* Profile completion bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="text-white/50">Profile Completion</span>
                        <span className="text-primary-400 font-semibold">{profilePercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${profilePercent}%` }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard icon={HiBriefcase} label="Jobs Available" value={mockStats.jobsAvailable} color="indigo" delay={0.1} />
                <StatsCard icon={HiPaperAirplane} label="Applications Sent" value={mockStats.applicationsSent} color="emerald" delay={0.15} />
                <StatsCard icon={HiCalendar} label="Interviews" value={mockStats.interviewsScheduled} color="amber" delay={0.2} />
                <StatsCard icon={HiStar} label="Offers Received" value={mockStats.offersReceived} color="rose" delay={0.25} />
            </div>

            {/* Eligible Jobs + Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Jobs */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Eligible Jobs</h2>
                        <a href="/student/jobs" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {eligibleJobs.map(job => (
                            <div key={job.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-primary-500/20 transition-all group">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{job.logo}</span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-medium text-sm truncate">{job.role}</h3>
                                        <p className="text-white/50 text-xs">{job.company}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3 text-xs text-white/40">
                                    <span className="flex items-center gap-1"><HiLocationMarker className="w-3 h-3" />{job.location}</span>
                                    <span className="text-emerald-400 font-semibold">{job.salary}</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="flex items-center gap-1 text-[11px] text-white/30"><HiClock className="w-3 h-3" />Deadline: {job.deadline}</span>
                                    <button className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-400 text-[11px] font-medium hover:bg-primary-500/30 transition-colors">Apply</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Notifications</h2>
                        <a href="/student/notifications" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                    </div>
                    <div className="space-y-3">
                        {mockNotifications.slice(0, 4).map(n => (
                            <div key={n.id} className={`p-3 rounded-xl border transition-colors cursor-pointer ${!n.read ? 'bg-primary-500/5 border-primary-500/10' : 'bg-white/[0.02] border-white/5'}`}>
                                <p className="text-white/80 text-sm font-medium">{n.title}</p>
                                <p className="text-white/30 text-xs mt-0.5">{n.time}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Applications + Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Recent Applications</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead><tr className="text-white/30 text-xs border-b border-white/5">
                                <th className="text-left pb-3 font-medium">Company</th>
                                <th className="text-left pb-3 font-medium">Role</th>
                                <th className="text-left pb-3 font-medium">Status</th>
                            </tr></thead>
                            <tbody>
                                {mockApplications.slice(0, 5).map(app => (
                                    <tr key={app.id} className="border-b border-white/5 last:border-0">
                                        <td className="py-3 text-white/80 font-medium">{app.company}</td>
                                        <td className="py-3 text-white/50">{app.role}</td>
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

                {/* Interviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Upcoming Interviews</h2>
                    <div className="space-y-3">
                        {mockInterviews.map(iv => (
                            <div key={iv.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-primary-500/20 transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-medium text-sm">{iv.company}</h3>
                                        <p className="text-white/40 text-xs mt-0.5">{iv.date} at {iv.time}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${iv.type === 'Online'
                                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                        }`}>{iv.type}</span>
                                </div>
                                {iv.type === 'Online' && iv.meetLink && (
                                    <a href={iv.meetLink} target="_blank" rel="noopener noreferrer"
                                        className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-colors w-fit">
                                        <HiExternalLink className="w-3.5 h-3.5" /> Join Meeting
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Resume Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4">Resume</h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center">
                            <HiDocumentText className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <p className="text-white font-medium text-sm">Resume {mockStudent.resumeVersion}</p>
                            <p className="text-white/40 text-xs">Last updated: {mockStudent.resumeLastUpdated}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">Download</button>
                        <button className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">Upload New</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function HiDocumentText(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
    );
}
