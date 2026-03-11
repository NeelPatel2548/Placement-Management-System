import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
    {
        resumeId: {
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
        fileUrl: {
            type: String,
            required: [true, 'File URL is required'],
            trim: true,
        },
        skills: {
            type: [String],
            default: [],
        },
        totalExperience: {
            type: String,
            trim: true,
        },
        education: {
            type: [String],
            default: [],
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
        isShortlistedByCompany: {
            type: [String],
            default: [],
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        // Legacy fields
        version: {
            type: String,
            default: '1.0',
            trim: true,
        },
        aiScore: {
            type: Number,
            min: 0,
            max: 100,
        },
    },
    {
        timestamps: true,
    }
);

resumeSchema.index({ studentRef: 1 });
resumeSchema.index({ studentId: 1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
