import { isValidRoomId } from "../../queries/room.js";

export const  registerRoomHandlers=(io, socket)=> {
  socket.on("joinRoom", async ({roomId}) => {
    try {
      console.log(roomId);
      const room = await isValidRoomId(roomId, socket.user.id);
      if (!room) return socket.emit("error", { message: "Room not found" });
      socket.join(roomId);
      socket.emit("joinedRoom", { roomId });
    } catch (err) {
      socket.emit("error", { message: "Server error" });
    }
  });
  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    socket.emit("leftRoom", { roomId });
  });
};
