import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiCalendar, HiLink, HiLocationMarker, HiClock, HiCheckCircle } from 'react-icons/hi';
import { companyMockInterviews } from './companyMockData';

export default function CompanyInterviews() {
    const [interviews] = useState(companyMockInterviews);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [form, setForm] = useState({ candidateName: '', jobTitle: '', date: '', time: '', type: 'online', meetLink: '', location: '' });

    const scheduled = interviews.filter(i => i.status === 'scheduled');
    const completed = interviews.filter(i => i.status === 'completed');

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Interviews</h1>
                    <p className="text-white/40 text-sm mt-1">Schedule and manage candidate interviews</p>
                </div>
                <button onClick={() => setShowScheduleForm(!showScheduleForm)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/20 transition-all">
                    + Schedule Interview
                </button>
            </motion.div>

            {/* Schedule Form */}
            {showScheduleForm && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f1120] border border-emerald-500/20 rounded-2xl p-6 space-y-4">
                    <h3 className="text-white font-semibold">Schedule New Interview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input value={form.candidateName} onChange={e => setForm({ ...form, candidateName: e.target.value })} placeholder="Candidate Name"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
                        <input value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} placeholder="Job Title"
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
                        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                        <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50" />
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50">
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                        </select>
                        {form.type === 'online' ? (
                            <input value={form.meetLink} onChange={e => setForm({ ...form, meetLink: e.target.value })} placeholder="Meeting Link"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
                        ) : (
                            <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location"
                                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-emerald-500/50" />
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setShowScheduleForm(false)} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold">
                            Schedule
                        </button>
                        <button onClick={() => setShowScheduleForm(false)} className="px-4 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm font-medium hover:bg-white/10 transition-colors">
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Upcoming Interviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <HiClock className="w-5 h-5 text-amber-400" /> Upcoming ({scheduled.length})
                </h2>
                {scheduled.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-6">No upcoming interviews scheduled</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {scheduled.map(iv => (
                            <div key={iv.id} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:border-emerald-500/20 transition-all">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-white font-medium text-sm">{iv.candidateName}</h3>
                                        <p className="text-white/40 text-xs mt-0.5">{iv.jobTitle}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${iv.type === 'online' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'}`}>
                                        {iv.type === 'online' ? '🎥 Online' : '🏢 Offline'}
                                    </span>
                                </div>
                                <div className="mt-3 space-y-1.5">
                                    <div className="flex items-center gap-2 text-white/40 text-xs">
                                        <HiCalendar className="w-3.5 h-3.5" /> {iv.date} at {iv.time}
                                    </div>
                                    {iv.type === 'online' && iv.meetLink && (
                                        <div className="flex items-center gap-2 text-blue-400 text-xs">
                                            <HiLink className="w-3.5 h-3.5" />
                                            <a href={iv.meetLink} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">{iv.meetLink}</a>
                                        </div>
                                    )}
                                    {iv.type === 'offline' && iv.location && (
                                        <div className="flex items-center gap-2 text-white/40 text-xs">
                                            <HiLocationMarker className="w-3.5 h-3.5" /> {iv.location}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Completed Interviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <HiCheckCircle className="w-5 h-5 text-emerald-400" /> Completed ({completed.length})
                </h2>
                {completed.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-6">No completed interviews</p>
                ) : (
                    <div className="space-y-2">
                        {completed.map(iv => (
                            <div key={iv.id} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4">
                                <div>
                                    <h3 className="text-white/70 font-medium text-sm">{iv.candidateName}</h3>
                                    <p className="text-white/30 text-xs">{iv.jobTitle} · {iv.date}</p>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                                    ✓ Completed
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
