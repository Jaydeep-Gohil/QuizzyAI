import express from "express";
import {
  startAttempt,
  submitAttempt,
  getQuizAttempts,
  getAttemptDetails,
  getMyAttempts,
} from "../controllers/quizAttempt.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const quizAttemptRouter = express.Router();

// ✅ All routes require authentication
quizAttemptRouter.use(protect);

// ✅ Start quiz attempt
quizAttemptRouter.post("/start", startAttempt);

// ✅ Submit quiz attempt
quizAttemptRouter.post("/:attemptId/submit", submitAttempt);

// ✅ Get all user's attempts (STATIC)
quizAttemptRouter.get("/my-attempts", getMyAttempts);

// ✅ Get user's attempts for a specific quiz
quizAttemptRouter.get("/quiz/:quizId", getQuizAttempts);

// ✅ Get single attempt details (DYNAMIC — must come last)
quizAttemptRouter.get("/:attemptId", getAttemptDetails);

export default quizAttemptRouter;
