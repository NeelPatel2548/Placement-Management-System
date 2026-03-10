import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// ─── GET /api/company/profile ───
export const getProfile = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            return res.status(404).json({ success: false, message: 'Company profile not found' });
        }

        res.json({
            success: true,
            company,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
            },
        });
    } catch (error) {
        console.error('❌ Get company profile error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/company/profile ───
export const updateProfile = async (req, res) => {
    try {
        const allowedFields = ['companyName', 'website', 'description', 'location', 'hrEmail', 'contactNumber'];
        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        }

        let company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            company = await Company.create({ userId: req.user._id, companyName: req.user.name, ...updates });
            await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
        } else {
            company = await Company.findOneAndUpdate(
                { userId: req.user._id },
                { $set: updates },
                { new: true, runValidators: true }
            );
        }

        res.json({ success: true, message: 'Profile updated', company });
    } catch (error) {
        console.error('❌ Update company profile error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/company/dashboard ───
export const getDashboard = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            return res.json({
                success: true,
                stats: { activeJobs: 0, totalApplicants: 0, interviews: 0, selected: 0 },
                user: { id: req.user._id, name: req.user.name, email: req.user.email },
            });
        }

        const activeJobs = await Job.countDocuments({ companyId: company._id, status: 'open' });
        const totalApplicants = await Application.countDocuments({ companyId: company._id });
        const interviews = await Interview.countDocuments({
            applicationId: {
                $in: await Application.find({ companyId: company._id }).distinct('_id'),
            },
        });
        const selected = await Application.countDocuments({ companyId: company._id, status: 'selected' });

        res.json({
            success: true,
            stats: { activeJobs, totalApplicants, interviews, selected },
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
            isApproved: company.isApproved,
        });
    } catch (error) {
        console.error('❌ Company dashboard error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/company/jobs ───
export const postJob = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            return res.status(400).json({ success: false, message: 'Create your company profile first' });
        }

        if (!company.isApproved) {
            return res.status(403).json({ success: false, message: 'Your company must be approved by admin before posting jobs' });
        }

        const { title, description, salary, location, jobType, eligibilityCgpa, eligibleBranches, skillsRequired, deadline } = req.body;

        if (!title || !jobType) {
            return res.status(400).json({ success: false, message: 'Title and job type are required' });
        }

        const job = await Job.create({
            companyId: company._id,
            title, description, salary, location, jobType,
            eligibilityCgpa, eligibleBranches: eligibleBranches || [],
            skillsRequired: skillsRequired || [], deadline,
        });

        company.jobsPosted.push(job._id);
        await company.save();

        // Notify eligible students
        const query = {};
        if (eligibilityCgpa) query.cgpa = { $gte: eligibilityCgpa };
        if (eligibleBranches && eligibleBranches.length > 0) query.branch = { $in: eligibleBranches };

        const eligibleStudents = await Student.find(query).select('userId');
        const notifications = eligibleStudents.map(s => ({
            userId: s.userId,
            title: 'New Job Posted',
            message: `${company.companyName} posted a new ${jobType} role: ${title}`,
            type: 'job',
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ success: true, message: 'Job posted successfully', job });
    } catch (error) {
        console.error('❌ Post job error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/company/jobs ───
export const getJobs = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            return res.json({ success: true, jobs: [] });
        }

        const jobs = await Job.find({ companyId: company._id })
            .sort({ createdAt: -1 });

        // Add applicant count for each job
        const jobsWithCounts = await Promise.all(
            jobs.map(async (job) => {
                const applicantCount = await Application.countDocuments({ jobId: job._id });
                return { ...job.toObject(), applicantCount };
            })
        );

        res.json({ success: true, jobs: jobsWithCounts });
    } catch (error) {
        console.error('❌ Get jobs error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/company/jobs/:jobId/applicants ───
export const getApplicants = async (req, res) => {
    try {
        const company = await Company.findOne({ userId: req.user._id });
        if (!company) {
            return res.status(403).json({ success: false, message: 'Company not found' });
        }

        const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const applications = await Application.find({ jobId: job._id })
            .populate({
                path: 'studentId',
                select: 'branch cgpa skills phone enrollmentNo',
                populate: { path: 'userId', select: 'name email' },
            })
            .populate('interviewId')
            .sort({ createdAt: -1 });

        res.json({ success: true, applications, job });
    } catch (error) {
        console.error('❌ Get applicants error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/company/applications/:appId/shortlist ───
export const shortlistCandidate = async (req, res) => {
    try {
        const application = await Application.findById(req.params.appId).populate('studentId');
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application.status = 'shortlisted';
        await application.save();

        // Notify student
        const student = await Student.findById(application.studentId).populate('userId', '_id');
        if (student) {
            const job = await Job.findById(application.jobId);
            await Notification.create({
                userId: student.userId._id || student.userId,
                title: 'Shortlisted!',
                message: `You have been shortlisted for ${job?.title || 'a position'}.`,
                type: 'result',
            });
        }

        res.json({ success: true, message: 'Candidate shortlisted', application });
    } catch (error) {
        console.error('❌ Shortlist error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/company/applications/:appId/reject ───
export const rejectCandidate = async (req, res) => {
    try {
        const application = await Application.findById(req.params.appId).populate('studentId');
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        application.status = 'rejected';
        await application.save();

        const student = await Student.findById(application.studentId).populate('userId', '_id');
        if (student) {
            const job = await Job.findById(application.jobId);
            await Notification.create({
                userId: student.userId._id || student.userId,
                title: 'Application Update',
                message: `Your application for ${job?.title || 'a position'} was not selected.`,
                type: 'result',
            });
        }

        res.json({ success: true, message: 'Candidate rejected', application });
    } catch (error) {
        console.error('❌ Reject error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/company/applications/:appId/interview ───
export const scheduleInterview = async (req, res) => {
    try {
        const { interviewDate, interviewType, meetingLink, location } = req.body;

        if (!interviewDate || !interviewType) {
            return res.status(400).json({ success: false, message: 'Interview date and type are required' });
        }

        const application = await Application.findById(req.params.appId);
        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        const interview = await Interview.create({
            applicationId: application._id,
            interviewDate,
            interviewType,
            meetingLink,
            location,
        });

        application.interviewId = interview._id;
        application.status = 'shortlisted';
        await application.save();

        // Notify student
        const student = await Student.findById(application.studentId).populate('userId', '_id');
        if (student) {
            const job = await Job.findById(application.jobId);
            await Notification.create({
                userId: student.userId._id || student.userId,
                title: 'Interview Scheduled',
                message: `Your interview for ${job?.title || 'a position'} is scheduled for ${new Date(interviewDate).toLocaleDateString()}.`,
                type: 'interview',
            });
        }

        res.status(201).json({ success: true, message: 'Interview scheduled', interview });
    } catch (error) {
        console.error('❌ Schedule interview error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/company/jobs/:jobId/results ───
export const uploadResults = async (req, res) => {
    try {
        const { selectedIds, rejectedIds } = req.body;

        if (selectedIds && selectedIds.length > 0) {
            await Application.updateMany(
                { _id: { $in: selectedIds } },
                { status: 'selected' }
            );

            // Notify selected students
            const selectedApps = await Application.find({ _id: { $in: selectedIds } }).populate('studentId');
            for (const app of selectedApps) {
                const student = await Student.findById(app.studentId).populate('userId', '_id');
                if (student) {
                    await Notification.create({
                        userId: student.userId._id || student.userId,
                        title: 'Congratulations! 🎉',
                        message: 'You have been selected for the position!',
                        type: 'result',
                    });

                    // Update placement status
                    student.placementStatus = 'placed';
                    await student.save();
                }
            }
        }

        if (rejectedIds && rejectedIds.length > 0) {
            await Application.updateMany(
                { _id: { $in: rejectedIds } },
                { status: 'rejected' }
            );
        }

        res.json({ success: true, message: 'Results uploaded' });
    } catch (error) {
        console.error('❌ Upload results error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
