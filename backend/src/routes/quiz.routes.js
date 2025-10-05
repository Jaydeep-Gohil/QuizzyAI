import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createManualQuiz,
  createAIQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzes,
} from "../controllers/quiz.controller.js";

const quizRouter = express.Router();

// Public: List quizzes
quizRouter.get("/", getQuizzes);

// Protected routes (instructors)
quizRouter.use(protect);

// Manual quiz creation
quizRouter.post("/manual", createManualQuiz);

// AI quiz creation
quizRouter.post("/ai", createAIQuiz);

// Get, update, delete by ID
quizRouter.get("/:id", getQuiz);
quizRouter.put("/:id", protect, updateQuiz);
quizRouter.delete("/:id", protect, deleteQuiz);

export default quizRouter;
