import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
    getDashboard, getCompanies, approveCompany, rejectCompany,
    getStudents, getJobs, getAnalytics,
    postAnnouncement, getReports, deleteUser,
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require JWT + admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Companies
router.get('/companies', getCompanies);
router.put('/companies/:companyId/approve', approveCompany);
router.put('/companies/:companyId/reject', rejectCompany);

// Students
router.get('/students', getStudents);

// Jobs
router.get('/jobs', getJobs);

// Analytics
router.get('/analytics', getAnalytics);

// Announcements
router.post('/announcements', postAnnouncement);

// Reports
router.get('/reports', getReports);

// User management
router.delete('/users/:userId', deleteUser);

export default router;
