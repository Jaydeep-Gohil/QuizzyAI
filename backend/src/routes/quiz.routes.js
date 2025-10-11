import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createManualQuiz,
  getQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizzes,
  getQuizStats,
  getMannualQuizess,
} from "../controllers/quiz.controller.js";
import {
  createAIQuiz,
  getAIQuize,
} from "../controllers/gemini.quiz.controller.js";

const quizRouter = express.Router();

// Public: List quizzes
quizRouter.get("/", getQuizzes);

// Protected routes (instructors)
quizRouter.use(protect);

// Manual quiz creation
quizRouter.post("/manual", createManualQuiz);
quizRouter.get("/get-mannual", getMannualQuizess);

// Get, update, delete by ID
quizRouter.get("/:id", getQuiz);
quizRouter.put("/:id", protect, updateQuiz);
quizRouter.delete("/:id", protect, deleteQuiz);

//gemini routes
quizRouter.post("/gemini/create", createAIQuiz);
quizRouter.get("/gemini/get", getAIQuize);

// Quiz statistics
quizRouter.get("/:quizId/statistics", getQuizStats);

export default quizRouter;
