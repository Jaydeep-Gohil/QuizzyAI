import asyncHandler from "../middlewares/async.middleware.js";
import Quiz from "../models/quiz.model.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import {
  createQuiz,
  findQuizById,
  updateQuizById,
  deleteQuizById,
  listQuizzes,
  getQuizStatistics,
} from "../dao/quiz.dao.js";

// Create quiz (manual)
export const createManualQuiz = asyncHandler(async (req, res) => {
  const quizData = { ...req.body, isAI: false, createdBy: req.user._id };

  if (!quizData.title || !quizData.category || !quizData.settings?.timeLimit) {
    return errorResponse(
      res,
      400,
      "Title, category and timeLimit are required"
    );
  }

  const quiz = await createQuiz(quizData);
  return successResponse(res, 201, quiz, "Manual quiz created successfully");
});

// Get quiz by ID
export const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await findQuizById(req.params.id);
  if (!quiz) return errorResponse(res, 404, "Quiz not found");

  return successResponse(res, 200, quiz, "Quiz retrieved successfully");
});

// ✅ Update Quiz
export const updateQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const updatedQuiz = await updateQuizById(id, req.body, userId);
    if (!updatedQuiz) return errorResponse(res, 404, "Quiz not found");

    return successResponse(res, 200, updatedQuiz, "Quiz updated successfully");
  } catch (err) {
    if (err.message.includes("Not authorized"))
      return errorResponse(res, 403, err.message);

    return errorResponse(res, 500, err.message || "Internal server error");
  }
});

// ✅ Delete Quiz
export const deleteQuiz = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const deletedId = await deleteQuizById(id, userId);
    if (!deletedId) return errorResponse(res, 404, "Quiz not found");

    return successResponse(
      res,
      200,
      { deletedId },
      "Quiz deleted successfully"
    );
  } catch (err) {
    if (err.message.includes("Not authorized"))
      return errorResponse(res, 403, err.message);

    return errorResponse(res, 500, err.message || "Internal server error");
  }
});

// List quizzes
export const getQuizzes = asyncHandler(async (req, res) => {
  const { limit = 10, category, difficulty, tags } = req.query;

  // Build filters
  const filters = {};
  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  if (tags) filters.tags = { $in: tags.split(",") };

  try {
    // ✅ Randomly fetch quizzes using aggregation
    const randomQuizzes = await Quiz.aggregate([
      { $match: filters },
      { $sample: { size: parseInt(limit) } }, // 👈 Randomly selects N docs
    ]);

    if (!randomQuizzes || randomQuizzes.length === 0) {
      return errorResponse(res, 404, "No quizzes found");
    }

    return successResponse(
      res,
      200,
      { quizzes: randomQuizzes, count: randomQuizzes.length },
      "Random quizzes fetched successfully"
    );
  } catch (error) {
    console.error("❌ Error fetching random quizzes:", error);
    return errorResponse(res, 500, error.message || "Internal server error");
  }
});

// Get quiz statistics
export const getQuizStats = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  console.log(`📊 Fetching statistics for quiz: ${quizId}`);

  try {
    const stats = await getQuizStatistics(quizId);

    return successResponse(
      res,
      200,
      stats,
      "Quiz statistics fetched successfully"
    );
  } catch (error) {
    console.error("❌ Error fetching quiz statistics:", error);
    return errorResponse(res, 500, error.message);
  }
});

// Get only manually created quizzes (not AI)
export const getMannualQuizess = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, difficulty, tags } = req.query;

  const filters = { isAI: false }; // Only non-AI quizzes
  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  if (tags) filters.tags = { $in: tags.split(",") };

  try {
    const result = await listQuizzes({
      page: parseInt(page),
      limit: parseInt(limit),
      ...filters,
    });

    if (!result || result.quizzes.length === 0) {
      return errorResponse(res, 404, "No manual quizzes found");
    }

    return successResponse(
      res,
      200,
      result,
      "Manual quizzes listed successfully"
    );
  } catch (error) {
    console.error("❌ Error fetching manual quizzes:", error);
    return errorResponse(
      res,
      500,
      error.message || "Failed to fetch manual quizzes"
    );
  }
});
