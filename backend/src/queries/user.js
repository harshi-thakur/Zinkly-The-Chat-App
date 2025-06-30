import { handleDbError } from "../utils/handleDbError.js";
import {User} from "../models/user.js";
export const createUser = handleDbError(async (userData)=>{
    const newUser = new User(userData);
    await newUser.save();
    return newUser._id;
});
export const isEmailExists = handleDbError(async (email)=>{
    return await User.exist({ email });  
});

export const isUsernameExists = handleDbError(async (username)=>{
    return await User.exist({ username });
});

export const getUserById = handleDbError(async (userId)=>{
    const user = await User.findById(userId).select('-password');
    return user;
});

export const isValidUserId = handleDbError(async (userId)=>{
    return await User.exists({_id:userId});
    
});
export const verifyPasswordUsingUsernameOrEmail =handleDbError( async (usernameOrEmail, enteredPassword) => {
  let user ;
  if(usernameOrEmail.includes('@')) 
    user= await User.findOne({ email: usernameOrEmail });
  else 
    user = await User.findOne({ username: usernameOrEmail });
  if (!user) return false;
  const isMatch = await user.comparePassword(enteredPassword);
  return isMatch ? user._id: '';
});

export const getUsersByName = handleDbError(async (name, page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const regex = new RegExp(name, 'i'); 
  const users = await User.find({ $or: [ { fullname: regex }, { username: regex } ] })
    .select('-password')
    .skip(skip)
    .limit(limit)
    .exec();
  
  return {
    users,
    currentPage: page,
    lastPage: users.length < limit,
  };
} );

export const updateUserById = handleDbError(async (userId, updateData) => {
    const  updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    return updatedUser;
});