import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        jobId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        companyId: {
            type: String,
            trim: true,
        },
        // Keep ObjectId ref for existing auth-flow queries
        companyRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
        },
        companyName: {
            type: String,
            trim: true,
        },
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        requiredSkills: {
            type: [String],
            default: [],
        },
        // Legacy field
        skillsRequired: {
            type: [String],
            default: [],
        },
        package: {
            type: Number,
            min: [0, 'Package cannot be negative'],
        },
        // Legacy field
        salary: {
            type: Number,
            min: [0, 'Salary cannot be negative'],
        },
        location: {
            type: String,
            trim: true,
        },
        jobType: {
            type: String,
            enum: ['fulltime', 'internship'],
            required: [true, 'Job type is required'],
        },
        minCGPA: {
            type: Number,
            min: [0, 'CGPA cannot be negative'],
            max: [10, 'CGPA cannot exceed 10'],
        },
        // Legacy field
        eligibilityCgpa: {
            type: Number,
            min: [0, 'CGPA cannot be negative'],
            max: [10, 'CGPA cannot exceed 10'],
        },
        eligibleBranches: {
            type: [String],
            default: [],
        },
        openings: {
            type: Number,
            min: [0, 'Openings cannot be negative'],
            default: 1,
        },
        deadline: {
            type: Date,
        },
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Application',
            },
        ],
        status: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open',
        },
        postedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

jobSchema.index({ companyId: 1 });
jobSchema.index({ companyRef: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ jobType: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
