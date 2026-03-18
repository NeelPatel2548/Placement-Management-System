import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
    getProfile, updateProfile, getDashboard,
    postJob, getJobs, getApplicants,
    shortlistCandidate, rejectCandidate,
    scheduleInterview, uploadResults,
    getCompanyApplications, getCompanyInterviews,
} from '../controllers/companyController.js';

const router = express.Router();

// All company routes require JWT + company role
router.use(protect);
router.use(authorize('company'));

// Dashboard
router.get('/dashboard', getDashboard);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Jobs
router.post('/jobs', postJob);
router.get('/jobs', getJobs);
router.get('/jobs/:jobId/applicants', getApplicants);
router.put('/jobs/:jobId/results', uploadResults);

// Applications — static routes BEFORE dynamic :appId routes
router.get('/applications', getCompanyApplications);
router.put('/applications/:appId/shortlist', shortlistCandidate);
router.put('/applications/:appId/reject', rejectCandidate);
router.post('/applications/:appId/interview', scheduleInterview);

// Interviews
router.get('/interviews', getCompanyInterviews);

export default router;
