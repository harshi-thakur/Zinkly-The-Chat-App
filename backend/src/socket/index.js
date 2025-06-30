import { Server } from 'socket.io';
import authorizer from './authorizer.js';
import { registerMessageHandlers, registerOnlineHandlers } from './handler/messageHandler.js';
import { registerRoomHandlers } from './handler/roomHandler.js';


function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  const onlineUsers = new Set();

  io.use(authorizer);

  io.on('connection',  (socket) => {  
    if(socket.user.id){
      onlineUsers.add(socket.user.id);
    }

    registerMessageHandlers(io,socket);
    registerOnlineHandlers(io,socket,onlineUsers);
    registerRoomHandlers(io,socket);
    
    socket.on("disconnect", () => {  
      if (socket.user.id) {
        onlineUsers.delete(socket.user.id);
      }
    });


  });
 
  return io;
}

export default setupSocket;
