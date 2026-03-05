import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: [true, 'Company reference is required'],
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
        location: {
            type: String,
            trim: true,
        },
        salary: {
            type: Number,
            min: [0, 'Salary cannot be negative'],
        },
        jobType: {
            type: String,
            enum: ['fulltime', 'internship'],
            required: [true, 'Job type is required'],
        },
        eligibilityCgpa: {
            type: Number,
            min: [0, 'CGPA cannot be negative'],
            max: [10, 'CGPA cannot exceed 10'],
        },
        eligibleBranches: {
            type: [String],
            default: [],
        },
        skillsRequired: {
            type: [String],
            default: [],
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
    },
    {
        timestamps: true,
    }
);

// Indexes for common queries
jobSchema.index({ companyId: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ jobType: 1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
