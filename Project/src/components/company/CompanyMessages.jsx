import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2, Send } from 'lucide-react';
import api from '../../services/api';

export default function CompanyMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeConversation, setActiveConversation] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get('/api/messages');
                setMessages(res.data.messages || []);
            } catch (err) {
                console.error('Fetch messages error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    // Group messages by conversationId
    const conversations = {};
    messages.forEach(msg => {
        const convId = msg.conversationId || msg._id;
        if (!conversations[convId]) {
            conversations[convId] = {
                id: convId,
                name: msg.senderRole === 'company' ? msg.receiverName : msg.senderName,
                messages: [],
            };
        }
        conversations[convId].messages.push(msg);
    });
    const convList = Object.values(conversations);

    // Sort messages within each conversation by timestamp
    convList.forEach(conv => {
        conv.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        conv.lastMessage = conv.messages[conv.messages.length - 1];
    });

    const activeMessages = activeConversation
        ? (conversations[activeConversation]?.messages || [])
        : [];

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 text-blue-500 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Messages</h1>
                <p className="text-white/40 text-sm">Conversations with candidates</p>
            </div>

            {messages.length === 0 ? (
                <div className="bg-[#111827] border border-white/5 rounded-2xl p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">No messages yet</p>
                </div>
            ) : (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111827] border border-white/5 rounded-2xl overflow-hidden flex h-[500px]">
                    {/* Left Panel – Conversations */}
                    <div className="w-72 border-r border-white/5 overflow-y-auto flex-shrink-0">
                        <div className="p-3 border-b border-white/5">
                            <p className="text-white/30 text-xs font-medium px-1">Conversations</p>
                        </div>
                        {convList.map(conv => (
                            <button key={conv.id} onClick={() => setActiveConversation(conv.id)}
                                className={`w-full text-left px-4 py-3.5 border-b border-white/5 hover:bg-white/[0.03] transition-colors ${activeConversation === conv.id ? 'bg-blue-500/10 border-l-2 border-l-blue-500' : ''}`}>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        {(conv.name || 'U')[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white/80 text-sm font-medium truncate">{conv.name || 'Unknown'}</p>
                                        <p className="text-white/30 text-[11px] truncate mt-0.5">{conv.lastMessage?.content || ''}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right Panel – Message Thread */}
                    <div className="flex-1 flex flex-col">
                        {!activeConversation ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <MessageSquare className="w-10 h-10 text-white/10 mx-auto mb-2" />
                                    <p className="text-white/20 text-sm">Select a conversation</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
                                    <p className="text-white font-medium text-sm">{conversations[activeConversation]?.name || 'Conversation'}</p>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                    {activeMessages.map(msg => (
                                        <div key={msg._id} className={`flex ${msg.senderRole === 'company' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                                                msg.senderRole === 'company'
                                                    ? 'bg-blue-600/30 text-white rounded-br-md'
                                                    : 'bg-white/5 text-white/80 rounded-bl-md'
                                            }`}>
                                                <p>{msg.content}</p>
                                                <p className="text-white/20 text-[10px] mt-1 text-right">
                                                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="px-4 py-3 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <input placeholder="Type a message..." className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500/50 transition-colors" />
                                        <button className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-600/20">
                                            <Send className="w-4 h-4 text-white" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
