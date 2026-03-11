import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
    {
        applicationId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        studentId: {
            type: String,
            trim: true,
        },
        // Keep ObjectId ref for existing flow
        studentRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        },
        studentName: {
            type: String,
            trim: true,
        },
        jobId: {
            type: String,
            trim: true,
        },
        // Keep ObjectId ref for existing flow
        jobRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
        },
        jobTitle: {
            type: String,
            trim: true,
        },
        companyId: {
            type: String,
            trim: true,
        },
        // Keep ObjectId ref for existing flow
        companyRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
        companyName: {
            type: String,
            trim: true,
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
        },
        appliedAt: {
            type: Date,
            default: Date.now,
        },
        // Legacy field
        appliedDate: {
            type: Date,
            default: Date.now,
        },
        status: {
            type: String,
            enum: ['applied', 'shortlisted', 'interview', 'hired', 'rejected', 'selected'],
            default: 'applied',
        },
        currentRound: {
            type: String,
            trim: true,
        },
        remarks: {
            type: String,
            trim: true,
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

applicationSchema.index({ studentRef: 1, jobRef: 1 }, { unique: true, sparse: true });
applicationSchema.index({ companyRef: 1 });
applicationSchema.index({ companyId: 1 });
applicationSchema.index({ status: 1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
