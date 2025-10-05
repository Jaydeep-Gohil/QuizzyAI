import express from "express";
import {
  verifyAccount,
  resendVerification,
} from "../controllers/public.controller.js";

const publicRouter = express.Router();

publicRouter.get("/verify/:token", verifyAccount);
publicRouter.post("/resend-verification", resendVerification);

export default publicRouter;
