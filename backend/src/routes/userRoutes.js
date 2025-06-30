import express from 'express'
import { getUser, updateUser, 
    // deleteUser,
     searchUser } from '../controllers/userController.js';

const userRoutes = express.Router();

userRoutes.route("/").get(getUser).patch(updateUser)
// .delete(deleteUser);
userRoutes.get("/search",searchUser);


export default userRoutes;