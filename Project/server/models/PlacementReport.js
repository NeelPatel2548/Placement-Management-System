import mongoose from 'mongoose';

const placementReportSchema = new mongoose.Schema(
    {
        reportId: {
            type: String,
            unique: true,
            sparse: true,
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
        academicYear: {
            type: String,
            trim: true,
        },
        // Legacy fields
        year: {
            type: Number,
        },
        branch: {
            type: String,
            trim: true,
        },
        totalStudents: {
            type: Number,
            min: 0,
            default: 0,
        },
        totalApplications: {
            type: Number,
            min: 0,
            default: 0,
        },
        totalHired: {
            type: Number,
            min: 0,
            default: 0,
        },
        // Legacy field
        placedStudents: {
            type: Number,
            min: 0,
            default: 0,
        },
        averagePackage: {
            type: Number,
            min: 0,
            default: 0,
        },
        // Legacy field
        averageSalary: {
            type: Number,
            min: 0,
            default: 0,
        },
        highestPackage: {
            type: Number,
            min: 0,
            default: 0,
        },
        // Legacy field
        highestSalary: {
            type: Number,
            min: 0,
            default: 0,
        },
        branchWiseHiring: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'published',
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

placementReportSchema.index({ companyId: 1 });

const PlacementReport = mongoose.model('PlacementReport', placementReportSchema);

export default PlacementReport;
