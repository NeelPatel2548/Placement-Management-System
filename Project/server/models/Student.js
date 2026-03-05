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
            unique: true,
            sparse: true,
            trim: true,
        },
        branch: {
            type: String,
            trim: true,
        },
        // Personal Information
        phone: {
            type: String,
            trim: true,
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        address: {
            type: String,
            trim: true,
        },
        // Academic Details
        tenthPercentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        twelfthPercentage: {
            type: Number,
            min: 0,
            max: 100,
        },
        cgpa: {
            type: Number,
            min: [0, 'CGPA cannot be negative'],
            max: [10, 'CGPA cannot exceed 10'],
        },
        currentSemester: {
            type: Number,
            min: 1,
            max: 8,
        },
        backlogs: {
            type: Boolean,
            default: false,
        },
        // Professional Details
        skills: {
            type: [String],
            default: [],
        },
        projects: {
            type: [String],
            default: [],
        },
        certifications: {
            type: [String],
            default: [],
        },
        internshipExperience: {
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
        // Resume
        resumeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Resume',
        },
        // Applications
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

studentSchema.index({ userId: 1 });

const Student = mongoose.model('Student', studentSchema);

export default Student;
