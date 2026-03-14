import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
    {
        companyId: {
            type: String,
            unique: true,
            required: [true, 'Company ID is required'],
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            sparse: true,
        },
        name: {
            type: String,
            required: [true, 'Company name is required'],
            trim: true,
        },
        // Keep legacy field for backward compat
        companyName: {
            type: String,
            trim: true,
        },
        industry: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
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
        hrName: {
            type: String,
            trim: true,
        },
        hrEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },
        hrPhone: {
            type: String,
            trim: true,
        },
        // Legacy field
        contactNumber: {
            type: String,
            trim: true,
        },
        logo: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        jobsPosted: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Job',
            },
        ],
    },
    {
        timestamps: true,
    }
);



const Company = mongoose.model('Company', companySchema);

export default Company;
