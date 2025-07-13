import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sentAt:{
        type:Number,
        default: Date.now,
        immutable: true
    }
},{
    timestamps: false});
const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);

export default Request;