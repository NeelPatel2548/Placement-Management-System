import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiChatAlt2, HiInbox } from 'react-icons/hi';
import api from '../../services/api';

export default function MessagesPage() {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendError, setSendError] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('pms_user') || '{}');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setLoading(true);
                const res = await api.get('/api/student/messages');
                setMessages(res.data.messages || []);
            } catch (err) {
                setError('Failed to load messages');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        try {
            setSending(true);
            setSendError('');
            await api.post('/api/student/messages', { subject: subject.trim() || 'General Query', content: message.trim() });
            setSent(true);
            setSubject('');
            setMessage('');
            // Refresh messages
            const res = await api.get('/api/student/messages');
            setMessages(res.data.messages || []);
            setTimeout(() => setSent(false), 3000);
        } catch (err) {
            setSendError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
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
                            <input type="text" placeholder="Enter subject..." value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-white/50 text-sm mb-1.5">Message</label>
                            <textarea placeholder="Write your message..." value={message} onChange={e => setMessage(e.target.value)} rows={5} className={inputClass} required />
                        </div>
                        <button type="submit" disabled={sending}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                            <HiPaperAirplane className="w-4 h-4 rotate-90" /> {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                    {sent && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                            Message sent successfully!
                        </motion.div>
                    )}
                    {sendError && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm text-center">
                            {sendError}
                        </motion.div>
                    )}
                </motion.div>

                {/* Message History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-[#0f1120] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <HiInbox className="w-5 h-5 text-amber-400" />
                        <h2 className="text-white font-semibold">Message History</h2>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="w-8 h-8 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                        </div>
                    ) : error ? (
                        <p className="text-red-400 text-sm text-center py-8">{error}</p>
                    ) : messages.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {messages.map(msg => {
                                const isSent = msg.senderId?._id === currentUser.id || msg.senderId === currentUser.id;
                                return (
                                    <div key={msg._id} className={`bg-white/[0.03] border border-white/5 rounded-xl p-4 ${isSent ? 'border-l-2 border-l-primary-500/50' : 'border-l-2 border-l-amber-500/50'}`}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-xs font-medium ${isSent ? 'text-primary-400' : 'text-amber-400'}`}>
                                                {isSent ? 'You' : (msg.senderId?.name || 'Admin')}
                                            </span>
                                            <span className="text-white/20 text-[11px]">{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}</span>
                                        </div>
                                        {msg.subject && <h3 className="text-white font-medium text-sm">{msg.subject}</h3>}
                                        <p className="text-white/40 text-xs mt-1 leading-relaxed">{msg.content}</p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <HiInbox className="w-10 h-10 text-white/10 mx-auto mb-2" />
                            <p className="text-white/30 text-sm">No messages yet</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
