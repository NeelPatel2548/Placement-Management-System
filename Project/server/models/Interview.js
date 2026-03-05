import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema(
    {
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application',
            required: [true, 'Application reference is required'],
        },
        interviewDate: {
            type: Date,
            required: [true, 'Interview date is required'],
        },
        interviewType: {
            type: String,
            enum: ['online', 'offline'],
            required: [true, 'Interview type is required'],
        },
        meetingLink: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['scheduled', 'completed'],
            default: 'scheduled',
        },
    },
    {
        timestamps: true,
    }
);

// Index on applicationId for fast lookups
interviewSchema.index({ applicationId: 1 });

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;
