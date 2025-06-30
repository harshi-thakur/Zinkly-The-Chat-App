import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'file'],
        required: true,
    },
    content:{
        type: String,
        required: true,
        trim: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sentAt: {
        type: Number,
    },
    processedAt: {
        type: Number,
        immutable: true
    }
},{
    timestamps: false,
});

messageSchema.pre('save', function (next) {
    if (!this.processedAt) {
        this.processedAt = Date.now();
    }
    next();
});
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;