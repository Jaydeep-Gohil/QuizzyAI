import Quiz from "../models/quiz.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

// Create quiz
export const createQuiz = async (quizData) => {
  const quiz = await Quiz.create(quizData);
  return quiz.toObject();
};

// Find quiz by ID
export const findQuizById = async (id) => {
  const quiz = await Quiz.findById(id);
  return quiz ? quiz.toObject() : null;
};

// Update quiz
export const updateQuizById = async (id, data, userId) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) return null;

  // Only the quiz creator (instructor) can update
  if (quiz.createdBy.toString() !== userId.toString()) {
    throw new Error("Not authorized to update this quiz");
  }

  Object.assign(quiz, data);
  await quiz.save();
  return quiz.toObject();
};

// Delete quiz
export const deleteQuizById = async (id, userId) => {
  const quiz = await Quiz.findById(id);
  if (!quiz) return null;

  if (quiz.createdBy.toString() !== userId.toString()) {
    throw new Error("Not authorized to delete this quiz");
  }

  await quiz.deleteOne();
  return quiz._id;
};

// List quizzes (optional filters) with statistics
export const listQuizzes = async ({ page = 1, limit = 10, ...filters }) => {
  const skip = (page - 1) * limit;
  const total = await Quiz.countDocuments(filters);

  const quizzes = await Quiz.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const quizObjects = quizzes.map((q) => q.toObject());

  // Get statistics for all quizzes in batch
  const quizIds = quizObjects.map((q) => q._id);
  const statsMap = await getBatchQuizStatistics(quizIds);

  // Append statistics to each quiz
  const quizzesWithStats = quizObjects.map((quiz) => ({
    ...quiz,
    statistics: statsMap[quiz._id.toString()] || {
      totalAttempts: 0,
      uniqueUsers: 0,
      averageScore: 0,
      averageTimeSpent: 0,
      passRate: 0,
      highestScore: 0,
      lowestScore: 0,
    },
  }));

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    quizzes: quizzesWithStats,
  };
};

// Get statistics for multiple quizzes (batch operation)
export const getBatchQuizStatistics = async (quizIds) => {
  if (!quizIds || quizIds.length === 0) return {};

  const stats = await QuizAttempt.aggregate([
    {
      $match: {
        quiz: { $in: quizIds.map((id) => new ObjectId(id)) },
        status: "completed",
      },
    },
    {
      $group: {
        _id: "$quiz",
        totalAttempts: { $sum: 1 },
        uniqueUsers: { $addToSet: "$user" },
        averageScore: { $avg: "$score.percentage" },
        averageTimeSpent: { $avg: "$timeSpent" },
        totalPassed: { $sum: { $cond: ["$passed", 1, 0] } },
        highestScore: { $max: "$score.percentage" },
        lowestScore: { $min: "$score.percentage" },
      },
    },
    {
      $project: {
        _id: 0,
        quizId: "$_id",
        totalAttempts: 1,
        uniqueUsers: { $size: "$uniqueUsers" },
        averageScore: { $round: ["$averageScore", 1] },
        averageTimeSpent: { $round: ["$averageTimeSpent", 0] },
        passRate: {
          $cond: [
            { $eq: ["$totalAttempts", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$totalPassed", "$totalAttempts"] },
                    100,
                  ],
                },
                1,
              ],
            },
          ],
        },
        highestScore: { $round: ["$highestScore", 1] },
        lowestScore: { $round: ["$lowestScore", 1] },
      },
    },
  ]);

  // Convert array to object map for easier lookup
  const statsMap = {};
  stats.forEach((stat) => {
    statsMap[stat.quizId.toString()] = {
      totalAttempts: stat.totalAttempts,
      uniqueUsers: stat.uniqueUsers,
      averageScore: stat.averageScore || 0,
      averageTimeSpent: stat.averageTimeSpent || 0,
      passRate: stat.passRate || 0,
      highestScore: stat.highestScore || 0,
      lowestScore: stat.lowestScore || 0,
    };
  });

  return statsMap;
};

// List quizzes with statistics
export const listQuizzesWithStats = async ({
  page = 1,
  limit = 10,
  ...filters
}) => {
  const skip = (page - 1) * limit;
  const total = await Quiz.countDocuments(filters);

  const quizzes = await Quiz.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const quizObjects = quizzes.map((q) => q.toObject());

  // Get statistics for all quizzes in batch
  const quizIds = quizObjects.map((q) => q._id);
  const statsMap = await getBatchQuizStatistics(quizIds);

  // Append statistics to each quiz
  const quizzesWithStats = quizObjects.map((quiz) => ({
    ...quiz,
    statistics: statsMap[quiz._id.toString()] || {
      totalAttempts: 0,
      uniqueUsers: 0,
      averageScore: 0,
      averageTimeSpent: 0,
      passRate: 0,
      highestScore: 0,
      lowestScore: 0,
    },
  }));

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    quizzes: quizzesWithStats,
  };
};

// Get quiz statistics
export const getQuizStatistics = async (quizId) => {
  // Get basic quiz info
  const quiz = await Quiz.findById(quizId).lean();
  if (!quiz) throw new Error("Quiz not found");

  // Get attempt statistics
  const attemptStats = await QuizAttempt.aggregate([
    { $match: { quiz: new ObjectId(quizId), status: "completed" } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        uniqueUsers: { $addToSet: "$user" },
        averageScore: { $avg: "$score.percentage" },
        averageTimeSpent: { $avg: "$timeSpent" },
        totalPassed: { $sum: { $cond: ["$passed", 1, 0] } },
        highestScore: { $max: "$score.percentage" },
        lowestScore: { $min: "$score.percentage" },
      },
    },
    {
      $project: {
        _id: 0,
        totalAttempts: 1,
        uniqueUsers: { $size: "$uniqueUsers" },
        averageScore: { $round: ["$averageScore", 1] },
        averageTimeSpent: { $round: ["$averageTimeSpent", 0] },
        passRate: {
          $cond: [
            { $eq: ["$totalAttempts", 0] },
            0,
            {
              $multiply: [{ $divide: ["$totalPassed", "$totalAttempts"] }, 100],
            },
          ],
        },
        highestScore: { $round: ["$highestScore", 1] },
        lowestScore: { $round: ["$lowestScore", 1] },
      },
    },
  ]);

  // Get question performance statistics
  const questionStats = await QuizAttempt.aggregate([
    { $match: { quiz: new ObjectId(quizId), status: "completed" } },
    { $unwind: "$answers" },
    {
      $group: {
        _id: "$answers.questionId",
        question: { $first: "$answers.question" },
        totalAnswers: { $sum: 1 },
        correctAnswers: { $sum: { $cond: ["$answers.isCorrect", 1, 0] } },
        averageTimeTaken: { $avg: "$answers.timeTaken" },
      },
    },
    {
      $project: {
        _id: 0,
        questionId: "$_id",
        question: 1,
        totalAnswers: 1,
        correctAnswers: 1,
        correctPercentage: {
          $cond: [
            { $eq: ["$totalAnswers", 0] },
            0,
            {
              $multiply: [
                { $divide: ["$correctAnswers", "$totalAnswers"] },
                100,
              ],
            },
          ],
        },
        averageTimeTaken: { $round: ["$averageTimeTaken", 1] },
      },
    },
    { $sort: { correctPercentage: -1 } },
  ]);

  // Get recent attempts
  const recentAttempts = await QuizAttempt.find({
    quiz: quizId,
    status: "completed",
  })
    .sort({ completedAt: -1 })
    .limit(5)
    .populate("user", "name email")
    .lean();

  return {
    quizInfo: {
      title: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      totalQuestions: quiz.questions.length,
      passingScore: quiz.settings.passingScore,
    },
    attemptStats:
      attemptStats.length > 0
        ? attemptStats[0]
        : {
            totalAttempts: 0,
            uniqueUsers: 0,
            averageScore: 0,
            averageTimeSpent: 0,
            passRate: 0,
            highestScore: 0,
            lowestScore: 0,
          },
    questionStats,
    recentAttempts: recentAttempts.map((attempt) => ({
      attemptId: attempt._id,
      user: attempt.user,
      score: attempt.score,
      timeSpent: attempt.timeSpent,
      completedAt: attempt.completedAt,
    })),
  };
};

// Fetch only AI-generated quizzes with statistics
export const listAIQuizzes = async ({ page = 1, limit = 10, ...filters }) => {
  const skip = (page - 1) * limit;

  // Always include AI filter
  const query = { ...filters, isAI: true };

  const total = await Quiz.countDocuments(query);

  const quizzes = await Quiz.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const quizObjects = quizzes.map((q) => q.toObject());

  // Get statistics for all quizzes in batch
  const quizIds = quizObjects.map((q) => q._id);
  const statsMap = await getBatchQuizStatistics(quizIds);

  // Append statistics to each quiz
  const quizzesWithStats = quizObjects.map((quiz) => ({
    ...quiz,
    statistics: statsMap[quiz._id.toString()] || {
      totalAttempts: 0,
      uniqueUsers: 0,
      averageScore: 0,
      averageTimeSpent: 0,
      passRate: 0,
      highestScore: 0,
      lowestScore: 0,
    },
  }));

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    quizzes: quizzesWithStats,
  };
};

// Fetch only AI-generated quizzes with statistics
export const listAIQuizzesWithStats = async ({
  page = 1,
  limit = 10,
  ...filters
}) => {
  const skip = (page - 1) * limit;

  // Always include AI filter
  const query = { ...filters, isAI: true };

  const total = await Quiz.countDocuments(query);

  const quizzes = await Quiz.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const quizObjects = quizzes.map((q) => q.toObject());

  // Get statistics for all quizzes in batch
  const quizIds = quizObjects.map((q) => q._id);
  const statsMap = await getBatchQuizStatistics(quizIds);

  // Append statistics to each quiz
  const quizzesWithStats = quizObjects.map((quiz) => ({
    ...quiz,
    statistics: statsMap[quiz._id.toString()] || {
      totalAttempts: 0,
      uniqueUsers: 0,
      averageScore: 0,
      averageTimeSpent: 0,
      passRate: 0,
      highestScore: 0,
      lowestScore: 0,
    },
  }));

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    quizzes: quizzesWithStats,
  };
};
