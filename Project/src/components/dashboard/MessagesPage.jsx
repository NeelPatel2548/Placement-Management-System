import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiSpeakerphone, HiChatAlt2 } from 'react-icons/hi';
import { mockAnnouncements } from './mockData';

export default function MessagesPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);

    const handleSend = (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;
        setSent(true);
        setSubject('');
        setMessage('');
        setTimeout(() => setSent(false), 3000);
    };

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all';

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-white/40 text-sm mt-1">Communicate with the placement cell</p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compose */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <HiChatAlt2 className="w-5 h-5 text-primary-400" />
                        <h2 className="text-white font-semibold">New Message</h2>
                    </div>
                    <form onSubmit={handleSend} className="space-y-4">
                        <div>
                            <label className="block text-white/50 text-sm mb-1.5">To</label>
                            <input type="text" value="Placement Cell" disabled className={`${inputClass} opacity-50`} />
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-1.5">Subject</label>
                            <input type="text" placeholder="Enter subject..." value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} required />
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-1.5">Message</label>
                            <textarea placeholder="Write your message..." value={message} onChange={e => setMessage(e.target.value)} rows={5} className={inputClass} required />
                        </div>
                        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <HiPaperAirplane className="w-4 h-4 rotate-90" /> Send Message
                        </button>
                    </form>
                    {sent && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                            Message sent successfully!
                        </motion.div>
                    )}
                </motion.div>

                {/* Announcements */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <HiSpeakerphone className="w-5 h-5 text-amber-400" />
                        <h2 className="text-white font-semibold">Admin Announcements</h2>
                    </div>
                    <div className="space-y-3">
                        {mockAnnouncements.map(ann => (
                            <div key={ann.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                                <h3 className="text-white font-medium text-sm">{ann.title}</h3>
                                <p className="text-white/40 text-xs mt-1.5 leading-relaxed">{ann.message}</p>
                                <div className="flex items-center gap-2 mt-3 text-white/20 text-[11px]">
                                    <span>{ann.author}</span>
                                    <span>•</span>
                                    <span>{ann.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
