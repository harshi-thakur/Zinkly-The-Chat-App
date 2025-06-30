import Room from "../../models/room.js";
import { createMessage } from "../../queries/message.js";
import { updateRoomById } from "../../queries/room.js";

const MAX_TIME_LIMIT= 5*60*1000;

export const  registerMessageHandlers = (io, socket)=>{
  socket.on("sendMessage", (data)=> onsendMessage(io,socket,data));
  socket.on("updateLatestMessage",(data)=>onUpdateLatestMessage(io,socket,data));
};



export const registerOnlineHandlers = (io, socket,onlineUsers)=> {
  socket.on("get-online-users",({userIds})=>{
    socket.emit('online-users',{userIds: userIds.filter(id=>onlineUsers.has(id))});
  });

  socket.on("typing", ({ roomId }) => {
    socket.to(roomId).emit("userTyping", { user: socket.user.id });
  });

  socket.on("stopTyping", ({ roomId }) => {
    socket.to(roomId).emit("userStoppedTyping", { user: socket.user.id});
  });
};


const onsendMessage  = (io,socket,data)=>{
  const {roomId,message}=data;
  const {type,tempId,content,sentAt}=message;
  if(!type||!content||!sentAt||!roomId){
    return socket.emit("error", {message:"Invalid Message Due To Internal Wokring At Client Side"});
  }

  if(Date.now()-sentAt>MAX_TIME_LIMIT){
    return socket.emit("isSent",{ roomId , tempId });
  }

  const newMessage = {
    room: roomId,
    sender: socket.user.id,
    type,
    content,
    sentAt,
    processedAt: Date.now()
  };
  
  const newId  =  createMessage(newMessage);
  debounceUpdateLatestMessage(roomId,newId);
  socket.to(roomId).emit("receiveMessage", newMessage);
  socket.emit("isSent",{ roomId , tempId ,  _id : newId });
}

const debounceUpdateLatestMessage = (roomId,latestMessageId)=>{
  if(debounceTimers.has(roomId)){
    clearTimeout(debounceTimers.get(roomId));
  }
  const timeout= setTimeout(async()=>{
    await updateRoomById(roomId,{latestMessage:latestMessageId});
    debounceTimers.delete(roomId);
  },5000);
  debounceTimers.set(roomId,timeout);
}