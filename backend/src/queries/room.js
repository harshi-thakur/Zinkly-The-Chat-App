import mongoose from "mongoose";
import Room  from "../models/room.js";
import { handleDbError } from "../utils/handleDbError.js";

export const createRoomByUserId = handleDbError(async (roomData) => {
  const newRoom = new Room(roomData);
  await newRoom.save();
  return newRoom._id;
});

export const getRoomById = handleDbError(async (roomId) => {
  const room = await Room.findById(roomId).populate("users", "-password");
  return room;
});

export const updateRoomById = handleDbError(async (roomId, updateData) => {
  await Room.findByIdAndUpdate(roomId, updateData);
});
    
export const  getRoomsByUserId= handleDbError(async(userId, page = 1, limit = 7) =>{
  const skip = (page - 1) * limit;

  const rooms = await Room.find({ members: userId })
    .sort({ updatedAt: -1 }) // Latest updated first
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'members',
      match: { _id: { $ne: userId } },
      options: { limit: 1 },
      select: 'username fullname profilePic'
    })
    .populate({
      path: 'groupSettings',
      select: 'groupName groupImage',
    });

  return {
    rooms,
    currentPage: page,
    lastPage: (!rooms|| rooms.length < limit),
  };
});

export const getRoomByUserId = handleDbError(async (userId, roomId) => {
  const room = await Room.findOne({ _id: roomId, members: userId })
                         .populate("members", "-email -password")
                         .populate("groupSettings");
    return room;
 });

  
export const isValidRoomId= handleDbError(async (roomId,userId)=>{
    return await Room.exists({ _id: roomId,members:userId}); 
});