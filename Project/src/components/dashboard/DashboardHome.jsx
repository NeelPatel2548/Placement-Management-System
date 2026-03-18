import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiBriefcase, HiPaperAirplane, HiCalendar, HiStar, HiLocationMarker, HiClock, HiExternalLink } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import StatsCard from './StatsCard';
import api from '../../services/api';
import { useRefreshOnChange } from '../../hooks/useRefreshOnChange';

const statusColors = {
    applied: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    shortlisted: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
    interview: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    selected: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/15 text-red-400 border-red-500/20',
};

export default function DashboardHome() {
    const [profile, setProfile] = useState(null);
    const [applications, setApplications] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const [profileRes, appsRes, interviewsRes, notifsRes, jobsRes] = await Promise.all([
                api.get('/api/student/profile').catch(() => ({ data: {} })),
                api.get('/api/student/applications').catch(() => ({ data: { applications: [] } })),
                api.get('/api/student/interviews').catch(() => ({ data: { interviews: [] } })),
                api.get('/api/notifications').catch(() => ({ data: { notifications: [] } })),
                api.get('/api/student/jobs').catch(() => ({ data: { jobs: [] } })),
            ]);

            setProfile(profileRes.data.student || null);
            setApplications(appsRes.data.applications || []);
            setInterviews(interviewsRes.data.interviews || []);
            setNotifications(notifsRes.data.notifications || []);
            setJobs(jobsRes.data.jobs || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useRefreshOnChange(fetchData);

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
                <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

    const name = user.name || profile?.userId?.name || 'Student';
    const placementStatus = profile?.placementStatus || 'unplaced';
    const cgpa = profile?.cgpa || 0;

    // Compute stats from real data
    const stats = {
        jobsAvailable: jobs.length,
        applicationsSent: applications.length,
        interviewsScheduled: interviews.filter(iv => iv.status === 'scheduled' || new Date(iv.interviewDate || iv.scheduledDate) >= new Date()).length,
        offersReceived: applications.filter(a => a.status === 'selected' || a.status === 'hired').length,
    };

    // Profile completion
    const profileFields = ['phone', 'dob', 'gender', 'address', 'enrollmentNo', 'branch', 'tenthPercentage', 'twelfthPercentage', 'cgpa', 'currentSemester', 'linkedin', 'github'];
    const filledFields = profile ? profileFields.filter(f => profile[f]).length : 0;
    const hasSkills = profile?.skills?.length > 0 ? 1 : 0;
    const hasResume = profile?.resumeId ? 1 : 0;
    const profilePercent = profile ? Math.round(((filledFields + hasSkills + hasResume) / (profileFields.length + 2)) * 100) : 0;

    // Eligible jobs (top 4)
    const eligibleJobs = jobs.slice(0, 4);

    // Upcoming interviews sorted by date
    const upcomingInterviews = [...interviews]
        .filter(iv => new Date(iv.interviewDate || iv.scheduledDate) >= new Date())
        .sort((a, b) => new Date(a.interviewDate || a.scheduledDate) - new Date(b.interviewDate || b.scheduledDate))
        .slice(0, 3);

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
                <StatsCard icon={HiBriefcase} label="Jobs Available" value={stats.jobsAvailable} color="indigo" delay={0.1} />
                <StatsCard icon={HiPaperAirplane} label="Applications Sent" value={stats.applicationsSent} color="emerald" delay={0.15} />
                <StatsCard icon={HiCalendar} label="Interviews" value={stats.interviewsScheduled} color="amber" delay={0.2} />
                <StatsCard icon={HiStar} label="Offers Received" value={stats.offersReceived} color="rose" delay={0.25} />
            </div>

            {/* Eligible Jobs + Notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Jobs */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Eligible Jobs</h2>
                        <a href="/student/jobs" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                    </div>
                    {eligibleJobs.length === 0 ? (
                        <div className="text-center py-8">
                            <HiBriefcase className="w-10 h-10 text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-sm">No eligible jobs available yet. Check back soon.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {eligibleJobs.map(job => (
                                <div key={job._id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-primary-500/20 transition-all group">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center text-primary-400 font-bold text-sm">
                                            {(job.companyName || job.title || '?')[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-medium text-sm truncate">{job.title}</h3>
                                            <p className="text-white/50 text-xs">{job.companyName || 'Company'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 text-xs text-white/40">
                                        <span className="flex items-center gap-1"><HiLocationMarker className="w-3 h-3" />{job.location || 'Remote'}</span>
                                        <span className="text-emerald-400 font-semibold">{job.package || job.salary ? `${job.package || job.salary} LPA` : 'Competitive'}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="flex items-center gap-1 text-[11px] text-white/30">
                                            <HiClock className="w-3 h-3" />
                                            {job.deadline ? `Deadline: ${new Date(job.deadline).toLocaleDateString()}` : 'Open'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Notifications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-semibold">Notifications</h2>
                        <a href="/student/notifications" className="text-primary-400 text-xs font-medium hover:text-primary-300">View All →</a>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-white/30 text-sm">No notifications yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.slice(0, 4).map(n => (
                                <div key={n._id} className={`p-3 rounded-xl border transition-colors cursor-pointer ${!n.isRead ? 'bg-primary-500/5 border-primary-500/10' : 'bg-white/[0.02] border-white/5'}`}>
                                    <p className="text-white/80 text-sm font-medium">{n.title}</p>
                                    <p className="text-white/30 text-xs mt-0.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Applications + Interviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Recent Applications</h2>
                    {applications.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-white/30 text-sm">No applications yet. Start applying to jobs!</p>
                        </div>
                    ) : (
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
                                            <td className="py-3 text-white/80 font-medium">{app.jobId?.companyId?.companyName || app.companyName || 'N/A'}</td>
                                            <td className="py-3 text-white/50">{app.jobId?.title || app.jobTitle || 'N/A'}</td>
                                            <td className="py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColors[app.status] || 'bg-gray-500/15 text-gray-400'}`}>
                                                    {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : '—'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Interviews */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <h2 className="text-white font-semibold mb-4">Upcoming Interviews</h2>
                    {upcomingInterviews.length === 0 ? (
                        <div className="text-center py-8">
                            <HiCalendar className="w-10 h-10 text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-sm">No upcoming interviews.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {upcomingInterviews.map(iv => (
                                <div key={iv._id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-primary-500/20 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-white font-medium text-sm">
                                                {iv.applicationId?.jobId?.companyId?.companyName || iv.companyName || 'Interview'}
                                            </h3>
                                            <p className="text-white/40 text-xs mt-0.5">
                                                {new Date(iv.interviewDate || iv.scheduledDate).toLocaleDateString()} at {new Date(iv.interviewDate || iv.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${(iv.mode || iv.type) === 'online'
                                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
                                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                            }`}>{(iv.mode || iv.type || 'TBD').charAt(0).toUpperCase() + (iv.mode || iv.type || 'TBD').slice(1)}</span>
                                    </div>
                                    {(iv.mode === 'online' || iv.type === 'Online') && iv.meetLink && (
                                        <a href={iv.meetLink} target="_blank" rel="noopener noreferrer"
                                            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 text-xs font-medium hover:bg-blue-500/25 transition-colors w-fit">
                                            <HiExternalLink className="w-3.5 h-3.5" /> Join Meeting
                                        </a>
                                    )}
                                </div>
                            ))}
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
                            {profile?.resumeId ? (
                                <>
                                    <p className="text-white font-medium text-sm">Resume {profile.resumeId.version || 'Uploaded'}</p>
                                    <p className="text-white/40 text-xs">Last updated: {profile.resumeId.createdAt ? new Date(profile.resumeId.createdAt).toLocaleDateString() : 'Recently'}</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-white font-medium text-sm">No Resume Uploaded</p>
                                    <p className="text-white/40 text-xs">Upload your resume to apply for jobs</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {profile?.resumeId?.fileUrl && (
                            <a href={profile.resumeId.fileUrl} target="_blank" rel="noopener noreferrer"
                                className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
                                Download
                            </a>
                        )}
                        <a href="/student/profile-setup" className="px-4 py-2 rounded-xl bg-primary-500/20 text-primary-400 text-sm font-medium hover:bg-primary-500/30 transition-colors">
                            {profile?.resumeId ? 'Upload New' : 'Upload Resume'}
                        </a>
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
