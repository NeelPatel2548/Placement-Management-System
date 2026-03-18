import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import PlacementReport from '../models/PlacementReport.js';
import Resume from '../models/Resume.js';
import Student from '../models/Student.js';

// ─── GET /api/companies ───
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find().sort({ createdAt: -1 });
        res.json({ success: true, companies });
    } catch (error) {
        console.error('❌ Get companies error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/jobs ───
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ postedAt: -1 });
        res.json({ success: true, jobs });
    } catch (error) {
        console.error('❌ Get jobs error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/jobs ───
export const createJob = async (req, res) => {
    try {
        const {
            jobId, companyId, companyName, title, description,
            requiredSkills, package: pkg, location, jobType,
            minCGPA, eligibleBranches, openings, deadline,
        } = req.body;

        if (!title || !jobType) {
            return res.status(400).json({ success: false, message: 'Title and job type are required' });
        }

        const job = await Job.create({
            jobId: jobId || `JOB${Date.now()}`,
            companyId,
            companyName,
            title,
            description,
            requiredSkills: requiredSkills || [],
            skillsRequired: requiredSkills || [],
            package: pkg,
            salary: pkg,
            location,
            jobType,
            minCGPA,
            eligibilityCgpa: minCGPA,
            eligibleBranches: eligibleBranches || [],
            openings: openings || 1,
            deadline,
            postedAt: new Date(),
        });

        res.status(201).json({ success: true, message: 'Job created successfully', job });
    } catch (error) {
        console.error('❌ Create job error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/applications ───
export const getApplications = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const applications = await Application.find(filter).sort({ appliedAt: -1 });
        res.json({ success: true, applications });
    } catch (error) {
        console.error('❌ Get applications error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PATCH /api/applications/:id ───
export const updateApplication = async (req, res) => {
    try {
        const { status, currentRound, remarks } = req.body;
        const updates = {};
        if (status) updates.status = status;
        if (currentRound) updates.currentRound = currentRound;
        if (remarks !== undefined) updates.remarks = remarks;

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { returnDocument: 'after', runValidators: true }
        );

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        res.json({ success: true, message: 'Application updated', application });
    } catch (error) {
        console.error('❌ Update application error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/interviews ───
export const getInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find().sort({ scheduledDate: -1 });
        res.json({ success: true, interviews });
    } catch (error) {
        console.error('❌ Get interviews error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/messages ───
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: -1 });
        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ Get messages error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/notifications ───
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ timestamp: -1 });
        res.json({ success: true, notifications });
    } catch (error) {
        console.error('❌ Get notifications error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/placementreports ───
export const getPlacementReports = async (req, res) => {
    try {
        const reports = await PlacementReport.find().sort({ generatedAt: -1 });
        res.json({ success: true, reports });
    } catch (error) {
        console.error('❌ Get placement reports error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/resumes ───
export const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find().sort({ uploadedAt: -1 });
        res.json({ success: true, resumes });
    } catch (error) {
        console.error('❌ Get resumes error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/public/stats (no auth) ───
export const getPublicStats = async (req, res) => {
    try {
        const [totalStudents, totalCompanies, totalJobs, placementAgg, topCompanies] = await Promise.all([
            Student.countDocuments(),
            Company.countDocuments({ isApproved: true }),
            Job.countDocuments({ status: 'open' }),
            PlacementReport.aggregate([
                { $group: { _id: null, total: { $sum: '$placedStudents' } } },
            ]),
            Company.find({ isApproved: true })
                .select('name industry website logo')
                .sort({ createdAt: -1 })
                .limit(12),
        ]);

        res.json({
            success: true,
            totalStudents,
            totalCompanies,
            totalPlacements: placementAgg.length > 0 ? placementAgg[0].total : 0,
            totalJobs,
            topCompanies,
        });
    } catch (error) {
        console.error('❌ Public stats error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/public/companies (no auth) ───
export const getTopCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ isApproved: true })
            .select('name companyName industry website location logo')
            .sort({ createdAt: -1 })
            .limit(6);

        res.json({ success: true, companies });
    } catch (error) {
        console.error('❌ Top companies error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
