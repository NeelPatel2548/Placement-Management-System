import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiCalendar, HiClock, HiLocationMarker, HiExternalLink, HiVideoCamera } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function InterviewsPage() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInterviews = useCallback(async () => {
        try {
            setError(null);
            const res = await api.get('/api/student/interviews');
            setInterviews(res.data.interviews || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load interviews');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInterviews();
    }, [fetchInterviews]);

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
                <button onClick={fetchInterviews} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

    const now = new Date();
    const upcoming = interviews.filter(iv => new Date(iv.interviewDate || iv.scheduledDate) >= now)
        .sort((a, b) => new Date(a.interviewDate || a.scheduledDate) - new Date(b.interviewDate || b.scheduledDate));
    const past = interviews.filter(iv => new Date(iv.interviewDate || iv.scheduledDate) < now)
        .sort((a, b) => new Date(b.interviewDate || b.scheduledDate) - new Date(a.interviewDate || a.scheduledDate));

    const InterviewCard = ({ iv, i }) => {
        const date = new Date(iv.interviewDate || iv.scheduledDate);
        const isOnline = iv.mode === 'online' || iv.type === 'Online';

        return (
            <motion.div key={iv._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * Math.min(i, 10) }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-primary-500/20 transition-all">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-white font-semibold text-lg">
                            {iv.applicationId?.jobId?.companyName || iv.companyName || 'Interview'}
                        </h3>
                        {iv.applicationId?.jobId?.title && (
                            <p className="text-white/40 text-sm mt-0.5">{iv.applicationId.jobId.title}</p>
                        )}
                        <span className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${isOnline
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                            }`}>
                            {isOnline ? <HiVideoCamera className="w-3 h-3" /> : <HiLocationMarker className="w-3 h-3" />}
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/40">
                        <HiCalendar className="w-4 h-4" /><span>{date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/40">
                        <HiClock className="w-4 h-4" /><span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {!isOnline && iv.location && (
                        <div className="flex items-center gap-2 text-white/40">
                            <HiLocationMarker className="w-4 h-4" /><span>{iv.location}</span>
                        </div>
                    )}
                    {iv.round && (
                        <div className="flex items-center gap-2 text-white/40">
                            <span className="text-white/30">Round:</span><span className="text-white/60">{iv.round}</span>
                        </div>
                    )}
                </div>
                {isOnline && iv.meetLink && (
                    <a href={iv.meetLink} target="_blank" rel="noopener noreferrer"
                        className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors">
                        <HiExternalLink className="w-4 h-4" /> Join Meeting
                    </a>
                )}
            </motion.div>
        );
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Interviews</h1>
                <p className="text-white/40 text-sm mt-1">Manage your upcoming and past interviews ({interviews.length} total)</p>
            </motion.div>

            {interviews.length === 0 ? (
                <div className="text-center py-16">
                    <HiCalendar className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40">No interviews scheduled yet</p>
                    <p className="text-white/20 text-sm mt-1">Apply to jobs and get shortlisted to receive interview invites.</p>
                </div>
            ) : (
                <>
                    {upcoming.length > 0 && (
                        <div>
                            <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">Upcoming ({upcoming.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                {upcoming.map((iv, i) => <InterviewCard key={iv._id} iv={iv} i={i} />)}
                            </div>
                        </div>
                    )}

                    {past.length > 0 && (
                        <div>
                            <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">Past ({past.length})</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-60">
                                {past.map((iv, i) => <InterviewCard key={iv._id} iv={iv} i={i} />)}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
