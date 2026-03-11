import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Protected route
router.use(protect);

router.get('/stats', getDashboardStats);

export default router;
