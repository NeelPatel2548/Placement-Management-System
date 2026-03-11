import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
    {
        messageId: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        senderId: {
            type: String,
            trim: true,
        },
        // Keep ObjectId ref for existing flow
        senderRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        senderName: {
            type: String,
            trim: true,
        },
        senderRole: {
            type: String,
            enum: ['student', 'company', 'admin'],
        },
        receiverId: {
            type: String,
            trim: true,
        },
        // Keep ObjectId ref for existing flow
        receiverRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiverName: {
            type: String,
            trim: true,
        },
        subject: {
            type: String,
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Message content is required'],
            trim: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        conversationId: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ senderRef: 1, receiverRef: 1 });
messageSchema.index({ receiverRef: 1, isRead: 1 });
messageSchema.index({ conversationId: 1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;
