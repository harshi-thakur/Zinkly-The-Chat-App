import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    createdAt: {
        type: Number,
        immutable: true,
    },
    latestMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    isGroup:{
        type: Boolean,
        default: false,
    },
    groupSettings:{
        admin:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        groupName: {
            type: String,
            trim: true,
        },
        groupImage: {
            type: String,
        }
    }},
    {timestamps: false});

roomSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = Date.now();
    }
    next();

});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
export default Room;