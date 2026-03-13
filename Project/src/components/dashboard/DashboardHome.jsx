import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiBriefcase, HiPaperAirplane, HiCalendar, HiStar, HiLocationMarker, HiClock, HiExternalLink } from 'react-icons/hi';
import StatsCard from './StatsCard';
import api from '../../services/api';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function DashboardHome() {
    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');
    const name = user.name || 'Student';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ jobsAvailable: 0, applicationsSent: 0, interviewsScheduled: 0, offersReceived: 0 });
    const [placementStatus, setPlacementStatus] = useState('unplaced');
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [profilePercent, setProfilePercent] = useState(0);
    const [resumeInfo, setResumeInfo] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [dashRes, jobsRes, appsRes, ivsRes, notifRes, profileRes] = await Promise.allSettled([
                    api.get('/api/student/dashboard'),
                    api.get('/api/student/jobs'),
                    api.get('/api/student/applications'),
                    api.get('/api/student/interviews'),
                    api.get('/api/student/notifications'),
                    api.get('/api/student/profile'),
                ]);

                if (dashRes.status === 'fulfilled') {
                    const d = dashRes.value.data;
                    setStats(d.stats || {});
                    setPlacementStatus(d.placementStatus || 'unplaced');
                }
                if (jobsRes.status === 'fulfilled') setJobs(jobsRes.value.data.jobs || []);
                if (appsRes.status === 'fulfilled') setApplications(appsRes.value.data.applications || []);
                if (ivsRes.status === 'fulfilled') setInterviews(ivsRes.value.data.interviews || []);
                if (notifRes.status === 'fulfilled') setNotifications(notifRes.value.data.notifications || []);

                if (profileRes.status === 'fulfilled') {
                    const student = profileRes.value.data.student || {};
                    // Calculate profile completion
                    const fields = ['phone', 'dob', 'gender', 'address', 'enrollmentNo', 'branch', 'tenthPercentage', 'twelfthPercentage', 'cgpa', 'currentSemester', 'linkedin', 'github'];
                    const filled = fields.filter(f => student[f]).length;
                    const hasSkills = (student.skills || []).length > 0 ? 1 : 0;
                    const hasResume = student.resumeId ? 1 : 0;
                    setProfilePercent(Math.round(((filled + hasSkills + hasResume) / (fields.length + 2)) * 100));
                    if (student.resumeId) {
                        setResumeInfo(typeof student.resumeId === 'object' ? student.resumeId : { _id: student.resumeId });
                    }
                }
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

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

    const eligibleJobs = jobs.slice(0, 4);

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
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${placementStatus === 'placed'
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                            }`}>
                            {placementStatus === 'placed' ? '✓ Placed' : '○ Not Placed'}
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
                <StatsCard icon={HiBriefcase} label="Jobs Available" value={stats.jobsAvailable || 0} color="indigo" delay={0.1} />
                <StatsCard icon={HiPaperAirplane} label="Applications Sent" value={stats.applicationsSent || 0} color="emerald" delay={0.15} />
                <StatsCard icon={HiCalendar} label="Interviews" value={stats.interviewsScheduled || 0} color="amber" delay={0.2} />
                <StatsCard icon={HiStar} label="Offers Received" value={stats.offersReceived || 0} color="rose" delay={0.25} />
            </div>

            {/* Eligible Jobs + Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Jobs */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Eligible Jobs</h2>
                        <a href="/student/jobs" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                    </div>
                    {eligibleJobs.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {eligibleJobs.map(job => (
                                <div key={job._id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-primary-500/20 transition-all group">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">💼</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-medium text-sm truncate">{job.title}</h3>
                                            <p className="text-white/50 text-xs">{job.companyId?.companyName || job.companyName || 'Company'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 text-xs text-white/40">
                                        <span className="flex items-center gap-1"><HiLocationMarker className="w-3 h-3" />{job.location || 'Remote'}</span>
                                        <span className="text-emerald-400 font-semibold">{job.salary || job.package ? `${job.salary || job.package} LPA` : '—'}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="flex items-center gap-1 text-[11px] text-white/30"><HiClock className="w-3 h-3" />Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : '—'}</span>
                                        <a href="/student/jobs" className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-400 text-[11px] font-medium hover:bg-primary-500/30 transition-colors">Apply</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-white/30 text-sm">No eligible jobs available right now</p>
                        </div>
                    )}
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Notifications</h2>
                        <a href="/student/notifications" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                    </div>
                    {notifications.length > 0 ? (
                        <div className="space-y-3">
                            {notifications.slice(0, 4).map(n => (
                                <div key={n._id} className={`p-3 rounded-xl border transition-colors cursor-pointer ${!n.isRead ? 'bg-primary-500/5 border-primary-500/10' : 'bg-white/[0.02] border-white/5'}`}>
                                    <p className="text-white/80 text-sm font-medium">{n.title}</p>
                                    <p className="text-white/30 text-xs mt-0.5">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-white/30 text-sm">No notifications yet</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Applications + Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Recent Applications</h2>
                    {applications.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="text-white/30 text-xs border-b border-white/5">
                                    <th className="text-left pb-3 font-medium">Company</th>
                                    <th className="text-left pb-3 font-medium">Role</th>
                                    <th className="text-left pb-3 font-medium">Status</th>
                                </tr></thead>
                                <tbody>
                                    {applications.slice(0, 5).map(app => (
                                        <tr key={app._id} className="border-b border-white/5 last:border-0">
                                            <td className="py-3 text-white/80 font-medium">{app.jobId?.companyId?.companyName || app.jobId?.companyName || '—'}</td>
                                            <td className="py-3 text-white/50">{app.jobId?.title || '—'}</td>
                                            <td className="py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status] || statusColors.applied}`}>
                                                    {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-white/30 text-sm">No applications yet. Start applying to jobs!</p>
                        </div>
                    )}
                </motion.div>

                {/* Interviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Upcoming Interviews</h2>
                    {interviews.length > 0 ? (
                        <div className="space-y-3">
                            {interviews.map(iv => (
                                <div key={iv._id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-primary-500/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white font-medium text-sm">{iv.applicationId?.jobId?.companyId?.companyName || 'Company'}</h3>
                                            <p className="text-white/40 text-xs mt-0.5">{iv.interviewDate ? new Date(iv.interviewDate).toLocaleDateString() : '—'} at {iv.interviewTime || '—'}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${iv.mode === 'online'
                                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                            }`}>{iv.mode === 'online' ? 'Online' : 'Offline'}</span>
                                    </div>
                                    {iv.mode === 'online' && iv.meetLink && (
                                        <a href={iv.meetLink} target="_blank" rel="noopener noreferrer"
                                            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-colors w-fit">
                                            <HiExternalLink className="w-3.5 h-3.5" /> Join Meeting
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-white/30 text-sm">No interviews scheduled yet</p>
                        </div>
                    )}
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
                            <p className="text-white font-medium text-sm">
                                {resumeInfo ? `Resume ${resumeInfo.version || ''}` : 'No resume uploaded'}
                            </p>
                            <p className="text-white/40 text-xs">
                                {resumeInfo?.createdAt ? `Uploaded: ${new Date(resumeInfo.createdAt).toLocaleDateString()}` : 'Upload your resume to apply'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {resumeInfo?.fileUrl && (
                            <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${resumeInfo.fileUrl}`} target="_blank" rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">Download</a>
                        )}
                        <a href="/student/profile" className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">Upload New</a>
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
