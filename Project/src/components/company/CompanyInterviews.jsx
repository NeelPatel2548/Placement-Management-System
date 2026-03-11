import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Loader2 } from 'lucide-react';
import api from '../../services/api';

const statusBadge = {
    scheduled: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
    cancelled: 'bg-red-500/15 text-red-400 border-red-500/20',
};

const modeBadge = {
    online: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
    offline: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
};

export default function CompanyInterviews() {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/api/interviews');
                setInterviews(res.data.interviews || []);
            } catch (err) {
                console.error('Fetch interviews error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Interviews</h1>
                <p className="text-white/40 text-sm">Track all scheduled interviews</p>
            </div>

            {interviews.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <CalendarDays className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No interviews scheduled</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-white/30 text-xs border-b border-white/5 bg-white/[0.02]">
                                    <th className="text-left p-4 font-medium">Student</th>
                                    <th className="text-left p-4 font-medium">Job</th>
                                    <th className="text-left p-4 font-medium">Date</th>
                                    <th className="text-left p-4 font-medium">Time</th>
                                    <th className="text-left p-4 font-medium">Mode</th>
                                    <th className="text-left p-4 font-medium">Round</th>
                                    <th className="text-left p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {interviews.map(iv => (
                                    <tr key={iv._id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-white/80 font-medium">{iv.studentName || 'N/A'}</td>
                                        <td className="p-4 text-white/50">{iv.jobTitle || 'N/A'}</td>
                                        <td className="p-4 text-white/50 text-xs">{iv.scheduledDate ? new Date(iv.scheduledDate).toLocaleDateString() : '—'}</td>
                                        <td className="p-4 text-white/50 text-xs">{iv.scheduledTime || '—'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${modeBadge[iv.mode] || 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
                                                {iv.mode === 'online' ? '🎥 Online' : '🏢 Offline'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white/50 text-xs">{iv.round || '—'}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge[iv.status] || 'bg-gray-500/15 text-gray-400 border-gray-500/20'}`}>
                                                {iv.status ? iv.status.charAt(0).toUpperCase() + iv.status.slice(1) : '—'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
