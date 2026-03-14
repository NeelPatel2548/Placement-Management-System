import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// Stats route is public

router.get('/stats', getDashboardStats);

export default router;
