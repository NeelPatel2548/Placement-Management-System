import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getCompanies, getJobs, createJob,
    getApplications, updateApplication,
    getInterviews, getMessages,
    getNotifications, getPlacementReports, getResumes,
} from '../controllers/publicController.js';

const router = express.Router();

// Routes below this are completely public and do not require JWT

// Companies
router.get('/companies', getCompanies);

// Jobs
router.get('/jobs', getJobs);
router.post('/jobs', protect, createJob);

// Applications
router.get('/applications', getApplications);
router.patch('/applications/:id', protect, updateApplication);

// Interviews
router.get('/interviews', getInterviews);

// Messages
router.get('/messages', getMessages);

// Notifications
router.get('/notifications', getNotifications);

// Placement Reports
router.get('/placementreports', getPlacementReports);

// Resumes
router.get('/resumes', getResumes);

export default router;
