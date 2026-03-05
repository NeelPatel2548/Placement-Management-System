import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── All company routes require JWT + company role ───
router.use(protect);
router.use(authorize('company'));

// GET /api/company/dashboard
router.get('/dashboard', async (req, res) => {
    res.json({
        success: true,
        message: 'Company dashboard data',
        user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role },
    });
});

export default router;
