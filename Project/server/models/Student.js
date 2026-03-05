import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
            unique: true,
        },
        enrollmentNo: {
            type: String,
            required: [true, 'Enrollment number is required'],
            unique: true,
            trim: true,
        },
        branch: {
            type: String,
            required: [true, 'Branch is required'],
            trim: true,
        },
        cgpa: {
            type: Number,
            min: [0, 'CGPA cannot be negative'],
            max: [10, 'CGPA cannot exceed 10'],
        },
        skills: {
            type: [String],
            default: [],
        },
        phone: {
            type: String,
            trim: true,
        },
        linkedin: {
            type: String,
            trim: true,
        },
        github: {
            type: String,
            trim: true,
        },
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
        },
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Application',
            },
        ],
        placementStatus: {
            type: String,
            enum: ['placed', 'unplaced'],
            default: 'unplaced',
        },
    },
    {
        timestamps: true,
    }
);

// Index on userId and enrollmentNo for fast lookups
studentSchema.index({ userId: 1 });
studentSchema.index({ enrollmentNo: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
