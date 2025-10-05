import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

// Protected route
userRouter.get("/me", protect, getMe);

export default userRouter;
