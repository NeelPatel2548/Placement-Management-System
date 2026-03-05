import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── All admin routes require JWT + admin role ───
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
    res.json({
        success: true,
        message: 'Admin dashboard data',
        user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    });
});

export default router;
