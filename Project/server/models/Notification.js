import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
    {
        notificationId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        // Keep ObjectId ref for existing flow
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        targetRole: {
            type: String,
            enum: ['student', 'company', 'admin', 'all'],
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
        },
        type: {
            type: String,
            enum: ['job', 'interview', 'result', 'security', 'announcement', 'system'],
            required: [true, 'Notification type is required'],
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        companyId: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ targetRole: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
