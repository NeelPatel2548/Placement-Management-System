import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiChatAlt2, HiUserCircle } from 'react-icons/hi';
import { Loader2 } from 'lucide-react';
import api from '../../services/api';

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [sendError, setSendError] = useState(null);
    const pollRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('pms_user') || '{}');

    const fetchMessages = useCallback(async () => {
        try {
            setError(null);
            const res = await api.get('/api/messages');
            setMessages(res.data.messages || []);
        } catch (err) {
            if (!pollRef.current) return;
            setError(err.response?.data?.message || 'Failed to load messages');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMessages();
        pollRef.current = setInterval(fetchMessages, 10000);
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [fetchMessages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !content.trim()) return;
        setSending(true);
        setSendError(null);
        try {
            await api.post('/api/messages', {
                subject: subject.trim(),
                content: content.trim(),
                receiverRole: 'admin',
            });
            setSubject('');
            setContent('');
            setSent(true);
            setTimeout(() => setSent(false), 3000);
            fetchMessages();
        } catch (err) {
            setSendError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-400/60 focus:ring-2 focus:ring-primary-400/20 transition-all';

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
                <button onClick={fetchMessages} className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors">Retry</button>
            </div>
        );
    }

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
                            <textarea placeholder="Write your message..." value={content} onChange={e => setContent(e.target.value)} rows={5} className={inputClass} required />
                        </div>
                        <button type="submit" disabled={sending} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60">
                            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <HiPaperAirplane className="w-4 h-4 rotate-90" />}
                            {sending ? 'Sending...' : 'Send Message'}
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
                        <HiChatAlt2 className="w-5 h-5 text-blue-400" />
                        <h2 className="text-white font-semibold">Message History</h2>
                    </div>
                    {messages.length === 0 ? (
                        <div className="text-center py-12">
                            <HiChatAlt2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 text-sm">No messages yet. Send your first message to the placement cell.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                            {messages.map(msg => {
                                const senderId = msg.senderId?._id || msg.senderId;
                                const isSender = senderId === user._id || senderId?.toString() === user._id;
                                return (
                                    <div key={msg._id} className={`p-4 rounded-xl border ${isSender
                                        ? 'bg-primary-500/5 border-primary-500/10 ml-4'
                                        : 'bg-white/[0.03] border-white/5 mr-4'
                                    }`}>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <HiUserCircle className="w-4 h-4 text-white/30" />
                                            <span className="text-white/60 text-xs font-medium">
                                                {isSender ? 'You' : (msg.senderId?.name || msg.senderName || 'Placement Cell')}
                                            </span>
                                            <span className="text-white/20 text-[10px] ml-auto">
                                                {new Date(msg.timestamp || msg.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                        {msg.subject && <h3 className="text-white/80 text-sm font-medium mb-1">{msg.subject}</h3>}
                                        <p className="text-white/40 text-sm leading-relaxed">{msg.content}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
