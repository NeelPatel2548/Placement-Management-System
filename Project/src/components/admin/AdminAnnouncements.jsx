import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiSpeakerphone, HiCheckCircle } from 'react-icons/hi';
import { adminMockAnnouncements } from './adminMockData';

export default function AdminAnnouncements() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [announcements] = useState(adminMockAnnouncements);

    const handleSend = (e) => {
        e.preventDefault();
        if (!title || !message) return;
        setSent(true);
        setTitle('');
        setMessage('');
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-white">Announcements</h1>
                <p className="text-white/40 text-sm mt-1">Broadcast announcements to all users</p>
            </motion.div>

            {sent && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm">
                    <HiCheckCircle className="w-5 h-5" /> Announcement sent to all users!
                </motion.div>
            )}

            {/* Post Form */}
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                onSubmit={handleSend} className="bg-[#0f1120] border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2"><HiSpeakerphone className="w-5 h-5 text-rose-400" /> New Announcement</h3>
                <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Announcement Title"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500/50" />
                <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4} placeholder="Write your announcement..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-rose-500/50 resize-none" />
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-rose-500/20 transition-all">
                    Send Announcement
                </button>
            </motion.form>

            {/* Past Announcements */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Past Announcements</h3>
                <div className="space-y-3">
                    {announcements.map(a => (
                        <div key={a.id} className="bg-white/5 border border-white/5 rounded-xl p-4">
                            <div className="flex items-start justify-between">
                                <h4 className="text-white font-medium text-sm">{a.title}</h4>
                                <span className="text-white/30 text-xs">{a.date}</span>
                            </div>
                            <p className="text-white/50 text-sm mt-1">{a.message}</p>
                            <p className="text-white/20 text-xs mt-2">Sent to {a.recipients} users</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
