import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: [true, 'Student reference is required'],
        },
        fileUrl: {
            type: String,
            required: [true, 'File URL is required'],
            trim: true,
        },
        version: {
            type: String,
            default: '1.0',
            trim: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
        aiScore: {
            type: Number,
            min: [0, 'AI Score cannot be negative'],
            max: [100, 'AI Score cannot exceed 100'],
        },
    },
    {
        timestamps: true,
    }
);

// Index on studentId for fast lookups
resumeSchema.index({ studentId: 1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
