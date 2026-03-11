import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Interview from '../models/Interview.js';

// ─── GET /api/dashboard/stats ───
export const getDashboardStats = async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();
        const scheduledInterviews = await Interview.countDocuments({ status: 'scheduled' });
        const totalHired = await Application.countDocuments({ status: { $in: ['hired', 'selected'] } });

        res.json({
            success: true,
            stats: {
                totalJobs,
                totalApplications,
                scheduledInterviews,
                totalHired,
            },
        });
    } catch (error) {
        console.error('❌ Dashboard stats error:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
