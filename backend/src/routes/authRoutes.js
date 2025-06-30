import express from 'express'
import { signup, login,verifyEmail,logout} from '../controllers/authController.js'

const authRoutes = express.Router();
authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/verifyEmail", verifyEmail);

export default authRoutes;
