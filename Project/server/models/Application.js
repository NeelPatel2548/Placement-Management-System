import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student reference is required'],
        },
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: [true, 'Job reference is required'],
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company reference is required'],
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'rejected', 'selected'],
            default: 'applied',
        },
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        interviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interview',
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate applications: one student per job
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ companyId: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
