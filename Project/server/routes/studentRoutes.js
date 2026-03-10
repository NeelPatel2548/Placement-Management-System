import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/upload.js';
import {
    setupProfile, getProfile, updateProfile,
    getDashboard, getEligibleJobs, applyToJob,
    getApplications, getInterviews,
    uploadResumeHandler,
    getNotifications, markNotificationRead,
    getAnalytics, sendMessage, getMessages,
} from '../controllers/studentController.js';

const router = express.Router();

// All student routes require JWT + student role
router.use(protect);
router.use(authorize('student'));

// Dashboard
router.get('/dashboard', getDashboard);

// Profile
router.post('/profile/setup', setupProfile);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Jobs
router.get('/jobs', getEligibleJobs);
router.post('/jobs/:jobId/apply', applyToJob);

// Applications
router.get('/applications', getApplications);

// Interviews
router.get('/interviews', getInterviews);

// Resume
router.post('/resume', uploadResume.single('resume'), uploadResumeHandler);

// Notifications
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

// Analytics
router.get('/analytics', getAnalytics);

// Messages
router.post('/messages', sendMessage);
router.get('/messages', getMessages);

export default router;
