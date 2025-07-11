import { isValidRoomId } from "../../queries/room.js";

export const  registerRoomHandlers=(io, socket)=> {
  socket.on("room:join", async ({roomId}) => {
    try {
      const room = await isValidRoomId(roomId, socket.user.id);
      if (!room) return socket.emit("error", { message: "Room not found" });
      socket.join(roomId);
      socket.to(roomId).emit("room:member_joined", { roomId:roomId ,userId:socket.user.id});
    } catch (err) {
      socket.emit("error", { message: "Server error" });
    }
  });

  socket.on("room:leave", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("room:member_left", { roomId:roomId ,userId:socket.user.id});
  });
};
