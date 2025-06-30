import Message from "../models/message.js"
import { handleDbError } from "../utils/handleDbError.js"

const MESSAGE_LIMIT=10
export const getMessageByRoomId = handleDbError(async (roomId,lastTimestamp)=>{
    const messages = (await Message.find({room:roomId,createdAt:{$lt:lastTimestamp}}).sort({ sentAt: -1 }).limit(MESSAGE_LIMIT).exec()).reverse();
    
    return {messages,lastPage: !messages||messages.length < MESSAGE_LIMIT};
});

export const createMessage = handleDbError( (messageData) => {
    const newMessage = new Message(messageData);
    const id=newMessage._id.toString();
    newMessage.save();
    return id;
}); 

export const isValidMessageId = handleDbError(async (messageId) => {
    return await Message.exists({_id:messageId});
});
