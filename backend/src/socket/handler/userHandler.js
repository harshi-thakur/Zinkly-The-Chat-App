import { createRequest, deleteRequest, getRequest } from "../../queries/request.js";
import { createRoomByUserId } from "../../queries/room.js";
import { isValidUserId } from "../../queries/user.js";
import { getSocketId, isUserOnline } from "../managers/onlineUsers.js";

export const registerRequestHandlers = (io, socket) => {
    socket.on("request:send", (data) => onSendRequest(io, socket, data));
    socket.on("request:unsend", (data) => onUnsendRequest(io, socket, data));
    socket.on("request:accept", (data) => onAcceptRequest(io, socket, data));
    socket.on("request:reject", (data) => onRejectRequest(io, socket, data));
}

const onAcceptRequest = async (io, socket, data) => {
    const { requestId } = data;
    if (!requestId) {
        return socket.emit("error", { message: "Invalid Request ID" });
    }
    try {
            const request = await getRequest(requestId);
            if (!request) {
                return socket.emit("error", { message: "Request not found" });
            }
            if(!await isValidUserId(request.sender._id)){
                return socket.emit("error", { message: "Invalid sender ID" });
            }

            const room = await createRoomByUserId({
                members: [request.sender._id, socket.user.id],
                isGroup: false, 
            });
            if (!room) {
                return socket.emit("error", { message: "Failed to create room" });
            }
            if (isUserOnline(request.sender._id)) {
                socket.to(getSocketId(request.sender._id)).emit("request:accepted", { room,requestId });
            }
            socket.emit("request:accepted", { room,requestId });
            await deleteRequest(requestId);
    } catch (error) {
        console.error("Error accepting request:", error);
        socket.emit("error", { message: "Failed to accept request" });
    }
}

const onSendRequest = async(io,socket,data)=>{
    const {userId}= data;
    if(!userId){
        return socket.emit("error", {message:"Invalid User ID"});
    }
    try {
        const request = await createRequest(socket.user.id, userId);
        if (isUserOnline(userId)) {
            socket.to(getSocketId(userId)).emit("request:received", { request });
        }
        socket.emit("request:sent", { request });
    } catch (error) {
        console.error("Error sending request:", error);
        socket.emit("error", { message: "Failed to send request" });
    }
}

const onRejectRequest = async (io, socket, data) => {
    const { requestId } = data;
    if (!requestId) {
        return socket.emit("error", { message: "Invalid Request ID" });
    }
    try {
        await deleteRequest(requestId);
    } catch (error) {
        console.error("Error rejecting request:", error);
    }
}

const onUnsendRequest= async (io, socket, data) => {
    const { requestId } = data;
    if (!requestId) {
        return socket.emit("error", { message: "Invalid Request ID" });
    }
    try {
        const request = await deleteRequest(requestId);
        if (isUserOnline(request.receiver._id)) {
            socket.to(getSocketId(request.receiver._id)).emit("request:unsent", { requestId });
        }
    } catch (error) {
        console.error("Error unsending request:", error);
        socket.emit("error", { message: "Failed to unsend request" });
    }
}