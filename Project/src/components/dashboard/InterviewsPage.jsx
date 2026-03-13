import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiCalendar, HiClock, HiLocationMarker, HiExternalLink, HiVideoCamera } from 'react-icons/hi';
import api from '../../services/api';

export default function InterviewsPage() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/student/interviews');
                setInterviews(res.data.interviews || []);
            } catch (err) {
                setError('Failed to load interviews');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInterviews();
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

    const now = new Date();
    const upcoming = interviews.filter(iv => iv.interviewDate && new Date(iv.interviewDate) >= now);
    const past = interviews.filter(iv => iv.interviewDate && new Date(iv.interviewDate) < now);

    const InterviewCard = ({ iv, i }) => (
        <motion.div key={iv._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}
            className="bg-[#0f1120] border border-white/5 rounded-2xl p-5 hover:border-primary-500/20 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-white font-semibold text-lg">{iv.applicationId?.jobId?.companyId?.companyName || 'Company'}</h3>
                    <p className="text-white/50 text-xs mt-0.5">{iv.applicationId?.jobId?.title || 'Position'}</p>
                    <span className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${iv.mode === 'online'
                            ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                            : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                        }`}>
                        {iv.mode === 'online' ? <HiVideoCamera className="w-3 h-3" /> : <HiLocationMarker className="w-3 h-3" />}
                        {iv.mode === 'online' ? 'Online' : 'Offline'}
                    </span>
                </div>
                {iv.round && (
                    <span className="px-2.5 py-1 rounded-lg bg-primary-500/15 text-primary-400 text-xs font-medium">{iv.round}</span>
                )}
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-white/40">
                    <HiCalendar className="w-4 h-4" /><span>{iv.interviewDate ? new Date(iv.interviewDate).toLocaleDateString() : '—'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                    <HiClock className="w-4 h-4" /><span>{iv.interviewTime || '—'}</span>
                </div>
                {iv.mode !== 'online' && iv.location && (
                    <div className="flex items-center gap-2 text-white/40">
                        <HiLocationMarker className="w-4 h-4" /><span>{iv.location}</span>
                    </div>
                )}
            </div>
            {iv.mode === 'online' && iv.meetLink && (
                <a href={iv.meetLink} target="_blank" rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium hover:bg-blue-500/30 transition-colors">
                    <HiExternalLink className="w-4 h-4" /> Join Meeting
                </a>
            )}
        </motion.div>
    );

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Interviews</h1>
                <p className="text-white/40 text-sm mt-1">Manage your upcoming and past interviews</p>
            </motion.div>

            {upcoming.length > 0 && (
                <div>
                    <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">Upcoming</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {upcoming.map((iv, i) => <InterviewCard key={iv._id} iv={iv} i={i} />)}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div>
                    <h2 className="text-white/60 text-sm font-semibold uppercase tracking-wider mb-3">Past</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 opacity-60">
                        {past.map((iv, i) => <InterviewCard key={iv._id} iv={iv} i={i} />)}
                    </div>
                </div>
            )}

            {interviews.length === 0 && (
                <div className="text-center py-16">
                    <HiCalendar className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/40">No interviews scheduled yet</p>
                </div>
            )}
        </div>
    );
}
