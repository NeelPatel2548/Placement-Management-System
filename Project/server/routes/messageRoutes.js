import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Message from '../models/Message.js';

const router = express.Router();

router.use(protect);

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

        res.status(201).json({ success: true, message: populated });
    } catch (error) {
        console.error('❌ Send message error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
