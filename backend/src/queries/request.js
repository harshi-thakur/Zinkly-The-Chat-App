import Request from "../models/request.js";
import { handleDbError } from "../utils/handleDbError.js";

export const getReceivedRequests = handleDbError(async (userId) => {
    return await Request.find({ receiver: userId }).populate('sender', 'username profilePicture fullname');

});

export const getSentRequests = handleDbError(async (userId) => {
    return await Request.find({ sender: userId }).populate('receiver', 'username profilePicture fullname');

});

export const getRequest = handleDbError(async (requestId) => {
    return await Request.findById(requestId)
        .populate('sender', 'username profilePicture fullname')
        .populate('receiver', 'username profilePicture fullname');
})
export const createRequest = handleDbError(async (senderId, receiverId) => {

    let request = await Request.findOne({ sender: senderId, receiver: receiverId }).populate('sender', 'username profilePicture fullname')
        .populate('receiver', 'username profilePicture fullname');
    
    if(request) return request
  
    request = new Request({
        sender: senderId,
        receiver: receiverId,
    });
    await request.save();
    return await request.populate([
    { path: 'sender', select: 'username fullname profilePic' },
    { path: 'receiver', select: 'username fullname profilePic' },
  ]);
       
});

export const deleteRequest = handleDbError(async (requestId) => {
    const request = await Request.findByIdAndDelete(requestId);
    return request;
});
