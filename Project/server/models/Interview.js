import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
    {
        interviewId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        applicationId: {
            type: String,
            trim: true,
        },
        // Keep ObjectId ref for existing flow
        applicationRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
        },
        studentId: {
            type: String,
            trim: true,
        },
        studentName: {
            type: String,
            trim: true,
        },
        companyId: {
            type: String,
            trim: true,
        },
        companyName: {
            type: String,
            trim: true,
        },
        jobId: {
            type: String,
            trim: true,
        },
        jobTitle: {
            type: String,
            trim: true,
        },
        scheduledDate: {
            type: Date,
        },
        scheduledTime: {
            type: String,
            trim: true,
        },
        mode: {
            type: String,
            enum: ['online', 'offline'],
        },
        // Legacy fields
        interviewDate: {
            type: Date,
        },
        interviewType: {
            type: String,
            enum: ['online', 'offline'],
        },
        venue: {
            type: String,
            trim: true,
        },
        meetingLink: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        round: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['scheduled', 'completed', 'cancelled'],
            default: 'scheduled',
        },
        feedback: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

interviewSchema.index({ applicationRef: 1 });
interviewSchema.index({ companyId: 1 });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
