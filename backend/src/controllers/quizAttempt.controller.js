import asyncHandler from "../middlewares/async.middleware.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import {
  startQuizAttempt,
  submitQuizAttempt,
  getUserAttempts,
  getAttemptById,
  getAllUserAttempts,
} from "../dao/quizAttempt.dao.js";

export const startAttempt = asyncHandler(async (req, res) => {
  const { quizId } = req.body;
  const userId = req.user._id;

  console.log(`📝 Starting quiz attempt: ${quizId} for user: ${userId}`);

  if (!quizId) {
    return errorResponse(res, 400, "Quiz ID is required");
  }

  try {
    const attempt = await startQuizAttempt({
      quizId,
      userId,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    console.log(`✅ Quiz attempt started: ${attempt._id}`);

    return successResponse(
      res,
      201,
      attempt,
      "Quiz attempt started successfully"
    );
  } catch (error) {
    console.error("❌ Error starting quiz attempt:", error);
    return errorResponse(res, 400, error.message);
  }
});

export const submitAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { answers } = req.body;
  const userId = req.user._id;

  console.log(`📤 Submitting quiz attempt: ${attemptId}`);

  if (!answers || !Array.isArray(answers)) {
    return errorResponse(res, 400, "Answers array is required");
  }

  try {
    const result = await submitQuizAttempt({
      attemptId,
      answers,
      userId,
    });

    console.log(`✅ Quiz submitted - Score: ${result.score.percentage}%`);

    return successResponse(res, 200, result, "Quiz submitted successfully");
  } catch (error) {
    console.error("❌ Error submitting quiz:", error);
    return errorResponse(res, 400, error.message);
  }
});

export const getQuizAttempts = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user._id;

  console.log(`📊 Fetching attempts for quiz: ${quizId}`);

  try {
    const result = await getUserAttempts({
      quizId,
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return successResponse(
      res,
      200,
      result,
      "Quiz attempts fetched successfully"
    );
  } catch (error) {
    console.error("❌ Error fetching attempts:", error);
    return errorResponse(res, 500, error.message);
  }
});

export const getAttemptDetails = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const userId = req.user._id;

  console.log(`📋 Fetching attempt details: ${attemptId}`);

  try {
    const attempt = await getAttemptById(attemptId, userId);

    if (!attempt) {
      return errorResponse(res, 404, "Quiz attempt not found");
    }

    return successResponse(
      res,
      200,
      attempt,
      "Attempt details fetched successfully"
    );
  } catch (error) {
    console.error("❌ Error fetching attempt details:", error);
    return errorResponse(res, 500, error.message);
  }
});

export const getMyAttempts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const userId = req.user._id;

  console.log(`📚 Fetching all attempts for user: ${userId}`);

  try {
    const result = await getAllUserAttempts({
      userId,
      page: parseInt(page),
      limit: parseInt(limit),
      status,
    });

    return successResponse(
      res,
      200,
      result,
      "Your quiz attempts fetched successfully"
    );
  } catch (error) {
    console.error("❌ Error fetching user attempts:", error);
    return errorResponse(res, 500, error.message);
  }
});
