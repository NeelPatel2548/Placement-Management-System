import mongoose from 'mongoose';

const placementReportSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: [true, 'Year is required'],
        },
        branch: {
            type: String,
            required: [true, 'Branch is required'],
            trim: true,
        },
        totalStudents: {
            type: Number,
            min: [0, 'Total students cannot be negative'],
            default: 0,
        },
        placedStudents: {
            type: Number,
            min: [0, 'Placed students cannot be negative'],
            default: 0,
        },
        averageSalary: {
            type: Number,
            min: [0, 'Average salary cannot be negative'],
            default: 0,
        },
        highestSalary: {
            type: Number,
            min: [0, 'Highest salary cannot be negative'],
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Unique index: one report per year per branch
placementReportSchema.index({ year: 1, branch: 1 }, { unique: true });

const PlacementReport = mongoose.model('PlacementReport', placementReportSchema);

export default PlacementReport;
