import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';

const router = express.Router();

router.use(protect);

// GET /api/messages/conversations — MUST be before GET / (route order)
router.get('/conversations', async (req, res) => {
    try {
        const userId = req.user._id.toString();

        const messages = await Message.find({
            $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
        })
            .populate('senderId', 'name email role')
            .populate('receiverId', 'name email role')
            .sort({ createdAt: -1 });

        const threadMap = new Map();
        messages.forEach(msg => {
            const isSender = msg.senderId && msg.senderId._id && msg.senderId._id.toString() === userId;
            const other = isSender ? msg.receiverId : msg.senderId;
            if (!other || !other._id) return;
            const otherId = other._id.toString();

            if (!threadMap.has(otherId)) {
                threadMap.set(otherId, {
                    partnerId: otherId,
                    partnerName: other.name || other.email || 'User',
                    partnerEmail: other.email || '',
                    partnerRole: other.role || '',
                    lastMessage: msg.content,
                    lastSubject: msg.subject,
                    timestamp: msg.createdAt,
                    unreadCount: 0,
                });
            }
            if (!isSender && !msg.isRead) {
                threadMap.get(otherId).unreadCount++;
            }
        });

        res.json({ success: true, conversations: Array.from(threadMap.values()) });
    } catch (error) {
        console.error('❌ Get conversations error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/messages — get user's messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
        })
            .populate('senderId', 'name email role')
            .populate('receiverId', 'name email role')
            .sort({ createdAt: -1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ Get messages error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/messages — send a message
router.post('/', async (req, res) => {
    try {
        const { receiverId, subject, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ success: false, message: 'Receiver and content are required' });
        }

        const message = await Message.create({
            senderId: req.user._id,
            receiverId,
            subject: subject || 'General',
            content,
        });

        const populated = await message.populate([
            { path: 'senderId', select: 'name email role' },
            { path: 'receiverId', select: 'name email role' },
        ]);

        // Create notification for receiver
        await Notification.create({
            userId: receiverId,
            title: 'New Message',
            message: `You have a new message: ${subject || 'General'}`,
            type: 'message',
        });

        res.status(201).json({ success: true, message: populated });
    } catch (error) {
        console.error('❌ Send message error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
