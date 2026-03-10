import User from '../models/User.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import PlacementReport from '../models/PlacementReport.js';

// ─── GET /api/admin/dashboard ───
export const getDashboard = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student', isVerified: true });
        const totalCompanies = await Company.countDocuments();
        const activeJobs = await Job.countDocuments({ status: 'open' });
        const totalPlacements = await Application.countDocuments({ status: 'selected' });
        const pendingCompanies = await Company.countDocuments({ isApproved: false });
        const totalApplications = await Application.countDocuments();

        res.json({
            success: true,
            stats: {
                totalStudents,
                totalCompanies,
                activeJobs,
                totalPlacements,
                pendingCompanies,
                totalApplications,
            },
            user: { id: req.user._id, name: req.user.name, email: req.user.email },
        });
    } catch (error) {
        console.error('❌ Admin dashboard error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/admin/companies ───
export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find()
            .populate('userId', 'name email isVerified')
            .sort({ createdAt: -1 });

        res.json({ success: true, companies });
    } catch (error) {
        console.error('❌ Get companies error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/admin/companies/:companyId/approve ───
export const approveCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.companyId,
            { isApproved: true },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        // Notify company
        await Notification.create({
            userId: company.userId,
            title: 'Company Approved',
            message: 'Your company has been approved! You can now post jobs.',
            type: 'result',
        });

        res.json({ success: true, message: 'Company approved', company });
    } catch (error) {
        console.error('❌ Approve company error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── PUT /api/admin/companies/:companyId/reject ───
export const rejectCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.companyId,
            { isApproved: false },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({ success: false, message: 'Company not found' });
        }

        res.json({ success: true, message: 'Company rejected', company });
    } catch (error) {
        console.error('❌ Reject company error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/admin/students ───
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate('userId', 'name email isVerified profileCompleted')
            .sort({ createdAt: -1 });

        res.json({ success: true, students });
    } catch (error) {
        console.error('❌ Get students error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/admin/jobs ───
export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('companyId', 'companyName')
            .sort({ createdAt: -1 });

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

// ─── GET /api/admin/analytics ───
export const getAnalytics = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        const placedStudents = await Student.countDocuments({ placementStatus: 'placed' });
        const placementPercentage = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

        // Average and highest salary from selected applications
        const selectedApps = await Application.find({ status: 'selected' }).populate('jobId', 'salary');
        const salaries = selectedApps.map(a => a.jobId?.salary || 0).filter(s => s > 0);
        const averageSalary = salaries.length > 0 ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) : 0;
        const highestSalary = salaries.length > 0 ? Math.max(...salaries) : 0;

        // Branch-wise placements
        const branchWise = await Student.aggregate([
            { $group: { _id: '$branch', total: { $sum: 1 }, placed: { $sum: { $cond: [{ $eq: ['$placementStatus', 'placed'] }, 1, 0] } } } },
            { $match: { _id: { $ne: null } } },
            { $sort: { total: -1 } },
        ]);

        // Company-wise hiring
        const companyWise = await Application.aggregate([
            { $match: { status: 'selected' } },
            { $group: { _id: '$companyId', hires: { $sum: 1 } } },
            { $lookup: { from: 'companies', localField: '_id', foreignField: '_id', as: 'company' } },
            { $unwind: '$company' },
            { $project: { companyName: '$company.companyName', hires: 1 } },
            { $sort: { hires: -1 } },
        ]);

        res.json({
            success: true,
            analytics: {
                placementPercentage,
                averageSalary,
                highestSalary,
                totalStudents,
                placedStudents,
                branchWise,
                companyWise,
            },
        });
    } catch (error) {
        console.error('❌ Analytics error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── POST /api/admin/announcements ───
export const postAnnouncement = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({ success: false, message: 'Title and message are required' });
        }

        // Broadcast to all verified users
        const users = await User.find({ isVerified: true }).select('_id');
        const notifications = users.map(u => ({
            userId: u._id,
            title,
            message,
            type: 'job', // general announcement type
        }));

        await Notification.insertMany(notifications);

        res.json({ success: true, message: `Announcement sent to ${users.length} users` });
    } catch (error) {
        console.error('❌ Announcement error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── GET /api/admin/reports ───
export const getReports = async (req, res) => {
    try {
        const reports = await PlacementReport.find().sort({ year: -1, branch: 1 });

        // If no reports exist, generate from current data
        if (reports.length === 0) {
            const branchData = await Student.aggregate([
                { $group: { _id: '$branch', total: { $sum: 1 }, placed: { $sum: { $cond: [{ $eq: ['$placementStatus', 'placed'] }, 1, 0] } } } },
                { $match: { _id: { $ne: null } } },
            ]);

            return res.json({ success: true, reports: [], liveData: branchData });
        }

        res.json({ success: true, reports });
    } catch (error) {
        console.error('❌ Reports error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ─── DELETE /api/admin/users/:userId ───
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Cannot delete admin users' });
        }

        // Clean up related data
        if (user.role === 'student') {
            const student = await Student.findOne({ userId: user._id });
            if (student) {
                await Application.deleteMany({ studentId: student._id });
                await Student.deleteOne({ _id: student._id });
            }
        } else if (user.role === 'company') {
            const company = await Company.findOne({ userId: user._id });
            if (company) {
                await Job.deleteMany({ companyId: company._id });
                await Company.deleteOne({ _id: company._id });
            }
        }

        await Notification.deleteMany({ userId: user._id });
        await User.deleteOne({ _id: user._id });

        res.json({ success: true, message: 'User deleted' });
    } catch (error) {
        console.error('❌ Delete user error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
