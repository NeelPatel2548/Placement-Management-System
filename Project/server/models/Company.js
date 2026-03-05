import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User reference is required'],
            unique: true,
        },
        companyName: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        website: {
            type: String,
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
        hrEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },
        contactNumber: {
            type: String,
            trim: true,
        },
        jobsPosted: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index on userId for fast lookups
companySchema.index({ userId: 1 });

const Company = mongoose.model('Company', companySchema);

export default Company;
