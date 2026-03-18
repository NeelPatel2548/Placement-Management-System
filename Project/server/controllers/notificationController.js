import Notification from '../models/Notification.js';

// ─── GET /api/notifications ───
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({ userId: req.user.id, isRead: false });

        res.json({ success: true, notifications, unreadCount });
    } catch (error) {
        console.error('❌ Get notifications error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/notifications/:id/read ───
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true },
            { returnDocument: 'after' }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, notification });
    } catch (error) {
        console.error('❌ Mark notification read error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/notifications/read-all ───
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user.id, isRead: false },
            { isRead: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('❌ Mark all read error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
