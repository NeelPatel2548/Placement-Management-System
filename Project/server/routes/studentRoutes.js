import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── All student routes require JWT + student role ───
router.use(protect);
router.use(authorize('student'));

// GET /api/student/dashboard — student dashboard data
router.get('/dashboard', async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Student dashboard data',
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                profileCompleted: req.user.profileCompleted,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/student/profile
router.get('/profile', async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                profileCompleted: req.user.profileCompleted,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

export default router;
