import Student from '../models/Student.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import Notification from '../models/Notification.js';
import Message from '../models/Message.js';

// ─── POST /api/student/profile/setup ───
export const setupProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const existing = await Student.findOne({ userId });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Profile already exists. Use update instead.' });
        }

        const {
            enrollmentNo, branch, phone, dob, gender, address,
            tenthPercentage, twelfthPercentage, cgpa, currentSemester, backlogs,
            skills, projects, certifications, internshipExperience,
            linkedin, github,
        } = req.body;

        const student = await Student.create({
            userId,
            enrollmentNo, branch, phone, dob, gender, address,
            tenthPercentage, twelfthPercentage, cgpa, currentSemester, backlogs,
            skills: skills || [], projects: projects || [], certifications: certifications || [],
            internshipExperience, linkedin, github,
        });

        // Mark profile as completed
        await User.findByIdAndUpdate(userId, { profileCompleted: true });

        res.status(201).json({ success: true, message: 'Profile setup complete', student });
    } catch (error) {
        console.error('❌ Profile setup error:', error.message);
        res.status(500).json({ success: false, message: 'Server error during profile setup' });
    }
};

// ─── GET /api/student/profile ───
export const getProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id }).populate('resumeId');
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        res.json({
            success: true,
            student,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                profileCompleted: req.user.profileCompleted,
            },
        });
    } catch (error) {
        console.error('❌ Get profile error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/student/profile ───
export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            'enrollmentNo', 'branch', 'phone', 'dob', 'gender', 'address',
            'tenthPercentage', 'twelfthPercentage', 'cgpa', 'currentSemester', 'backlogs',
            'skills', 'projects', 'certifications', 'internshipExperience',
            'linkedin', 'github',
        ];

        const updates = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        const student = await Student.findOneAndUpdate(
            { userId: req.user.id },
            { $set: updates },
            { returnDocument: 'after', runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        res.json({ success: true, message: 'Profile updated', student });
    } catch (error) {
        console.error('❌ Update profile error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/student/dashboard ───
export const getDashboard = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        const jobsCount = await Job.countDocuments({ status: 'open' });
        const applicationsCount = student ? await Application.countDocuments({ studentId: student._id }) : 0;
        const interviewsCount = student
            ? await Interview.countDocuments({
                applicationId: { $in: await Application.find({ studentId: student._id }).distinct('_id') },
                status: 'scheduled',
            })
            : 0;
        const offersCount = student ? await Application.countDocuments({ studentId: student._id, status: 'selected' }) : 0;

        const unreadNotifications = await Notification.countDocuments({ userId: req.user.id, isRead: false });

        res.json({
            success: true,
            user: {
                id: req.user.id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                profileCompleted: req.user.profileCompleted,
            },
            stats: {
                jobsAvailable: jobsCount,
                applicationsSent: applicationsCount,
                interviewsScheduled: interviewsCount,
                offersReceived: offersCount,
            },
            unreadNotifications,
            placementStatus: student?.placementStatus || 'unplaced',
        });
    } catch (error) {
        console.error('❌ Dashboard error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/student/jobs ───
export const getEligibleJobs = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        let query = { status: 'open' };
        if (student) {
            query = {
                status: 'open',
                ...(student.cgpa && { eligibilityCgpa: { $lte: student.cgpa } }),
                ...(student.branch && { eligibleBranches: student.branch }),
            };
        }

        const jobs = await Job.find(query)
            .populate('companyId', 'companyName website location')
            .sort({ createdAt: -1 });

        res.json({ success: true, jobs });
    } catch (error) {
        console.error('❌ Get jobs error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/student/jobs/:jobId/apply ───
export const applyToJob = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) {
            return res.status(400).json({ success: false, message: 'Complete your profile first' });
        }

        const job = await Job.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        if (job.status !== 'open') {
            return res.status(400).json({ success: false, message: 'Applications are closed for this job' });
        }

        // Check eligibility
        if (student.cgpa && job.eligibilityCgpa && student.cgpa < job.eligibilityCgpa) {
            return res.status(400).json({ success: false, message: 'You do not meet the CGPA requirement' });
        }

        if (job.eligibleBranches.length > 0 && student.branch && !job.eligibleBranches.includes(student.branch)) {
            return res.status(400).json({ success: false, message: 'Your branch is not eligible for this job' });
        }

        const application = await Application.create({
            studentId: student._id,
            jobId: job._id,
            companyId: job.companyId,
            resumeId: student.resumeId,
            status: 'applied',
        });

        // Push to student and job application arrays
        student.applications.push(application._id);
        await student.save();

        job.applications.push(application._id);
        await job.save();

        // Create notification
        await Notification.create({
            userId: req.user.id,
            title: 'Application Submitted',
            message: `Your application for ${job.title} has been submitted successfully.`,
            type: 'job',
        });

        res.status(201).json({ success: true, message: 'Application submitted', application });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }
        console.error('❌ Apply error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/student/applications ───
export const getApplications = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) {
            return res.json({ success: true, applications: [] });
        }

        const applications = await Application.find({ studentId: student._id })
            .populate({
                path: 'jobId',
                select: 'title salary location jobType',
                populate: { path: 'companyId', select: 'companyName' },
            })
            .populate('interviewId')
            .sort({ createdAt: -1 });

        res.json({ success: true, applications });
    } catch (error) {
        console.error('❌ Get applications error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/student/interviews ───
export const getInterviews = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) {
            return res.json({ success: true, interviews: [] });
        }

        const studentApps = await Application.find({ studentId: student._id }).distinct('_id');
        const interviews = await Interview.find({
            applicationId: { $in: studentApps },
        })
            .populate({
                path: 'applicationId',
                populate: {
                    path: 'jobId',
                    select: 'title',
                    populate: { path: 'companyId', select: 'companyName' },
                },
            })
            .sort({ interviewDate: 1 });

        res.json({ success: true, interviews });
    } catch (error) {
        console.error('❌ Get interviews error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/student/resume ───
export const uploadResumeHandler = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const student = await Student.findOne({ userId: req.user.id });
        if (!student) {
            return res.status(400).json({ success: false, message: 'Complete your profile first' });
        }

        const resume = await Resume.create({
            studentId: student._id,
            fileUrl: `/uploads/resumes/${req.file.filename}`,
            version: `v${Date.now()}`,
        });

        student.resumeId = resume._id;
        await student.save();

        res.json({ success: true, message: 'Resume uploaded', resume });
    } catch (error) {
        console.error('❌ Resume upload error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/student/notifications ───
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, notifications });
    } catch (error) {
        console.error('❌ Get notifications error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/student/notifications/:id/read ───
export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { isRead: true },
            { returnDocument: 'after' }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, notification });
    } catch (error) {
        console.error('❌ Mark read error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/student/analytics ───
export const getAnalytics = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });
        if (!student) {
            return res.json({ success: true, analytics: { applicationsVsInterviews: [], placementProgress: [] } });
        }

        const applications = await Application.find({ studentId: student._id });
        const statusCounts = { applied: 0, shortlisted: 0, interview: 0, selected: 0, rejected: 0 };
        applications.forEach(app => {
            if (statusCounts[app.status] !== undefined) statusCounts[app.status]++;
        });

        const placementProgress = Object.entries(statusCounts).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value,
        }));

        res.json({
            success: true,
            analytics: {
                totalApplications: applications.length,
                placementProgress,
            },
        });
    } catch (error) {
        console.error('❌ Analytics error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/student/messages ───
export const sendMessage = async (req, res) => {
    try {
        const { content, subject } = req.body;
        if (!content) {
            return res.status(400).json({ success: false, message: 'Message content is required' });
        }

        // Find admin users to send to (placement cell)
        const admins = await User.find({ role: 'admin' }).select('_id');
        if (admins.length === 0) {
            return res.status(400).json({ success: false, message: 'No admin users found' });
        }

        const message = await Message.create({
            senderId: req.user.id,
            receiverId: admins[0]._id,
            subject: subject || 'General Query',
            content,
        });

        res.status(201).json({ success: true, message: 'Message sent', data: message });
    } catch (error) {
        console.error('❌ Send message error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/student/messages ───
export const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [{ senderId: req.user.id }, { receiverId: req.user.id }],
        })
            .populate('senderId', 'name email role')
            .populate('receiverId', 'name email role')
            .sort({ createdAt: -1 });

        res.json({ success: true, messages });
    } catch (error) {
        console.error('❌ Get messages error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
