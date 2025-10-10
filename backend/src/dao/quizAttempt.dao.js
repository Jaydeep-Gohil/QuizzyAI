import QuizAttempt from "../models/quizAttempt.model.js";
import Quiz from "../models/quiz.model.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

export const startQuizAttempt = async ({
  quizId,
  userId,
  ipAddress,
  userAgent,
}) => {
  // Get quiz details
  const quiz = await Quiz.findById(quizId);
  if (!quiz) throw new Error("Quiz not found");

  // Check if user has reached attempt limit
  if (quiz.settings.attemptsAllowed !== -1) {
    const previousAttempts = await QuizAttempt.countDocuments({
      quiz: quizId,
      user: userId,
      status: "completed",
    });

    if (previousAttempts >= quiz.settings.attemptsAllowed) {
      throw new Error("Maximum attempts reached for this quiz");
    }
  }

  // Get attempt number
  const attemptNumber =
    (await QuizAttempt.countDocuments({
      quiz: quizId,
      user: userId,
    })) + 1;

  // Create new attempt
  const attempt = await QuizAttempt.create({
    quiz: quizId,
    user: userId,
    quizSnapshot: {
      title: quiz.title,
      category: quiz.category,
      difficulty: quiz.difficulty,
      totalQuestions: quiz.questions.length,
      timeLimit: quiz.settings.timeLimit,
    },
    startedAt: new Date(),
    attemptNumber,
    ipAddress,
    userAgent,
    passingScore: quiz.settings.passingScore,
    score: {
      total: quiz.questions.reduce((sum, q) => sum + (q.points || 10), 0),
    },
  });

  return attempt.toObject();
};

export const submitQuizAttempt = async ({ attemptId, answers, userId }) => {
  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    user: userId,
  });

  if (!attempt) throw new Error("Quiz attempt not found");
  if (attempt.status === "completed") throw new Error("Quiz already completed");

  // Get quiz with questions
  const quiz = await Quiz.findById(attempt.quiz);
  if (!quiz) throw new Error("Quiz not found");

  // Calculate results
  let correctCount = 0;
  let wrongCount = 0;
  let obtainedScore = 0;

  const evaluatedAnswers = answers.map((answer) => {
    const question = quiz.questions.id(answer.questionId);
    if (!question) {
      return {
        ...answer,
        isCorrect: false,
        points: 0,
        maxPoints: 10,
      };
    }

    const isCorrect = answer.selectedAnswer === question.correctAnswer;
    const points = isCorrect ? question.points || 10 : 0;

    if (isCorrect) correctCount++;
    else wrongCount++;

    obtainedScore += points;

    return {
      questionId: answer.questionId,
      question: question.question,
      selectedAnswer: answer.selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      points,
      maxPoints: question.points || 10,
      timeTaken: answer.timeTaken || 0,
    };
  });

  const totalScore = attempt.score.total;
  const percentage = (obtainedScore / totalScore) * 100;
  const passed = percentage >= attempt.passingScore;

  const completedAt = new Date();
  const timeSpent = Math.floor((completedAt - attempt.startedAt) / 1000);

  // Update attempt
  attempt.answers = evaluatedAnswers;
  attempt.score.obtained = obtainedScore;
  attempt.score.percentage = Math.round(percentage * 100) / 100;
  attempt.correctAnswers = correctCount;
  attempt.wrongAnswers = wrongCount;
  attempt.skippedAnswers = quiz.questions.length - answers.length;
  attempt.passed = passed;
  attempt.status = "completed";
  attempt.completedAt = completedAt;
  attempt.timeSpent = timeSpent;

  await attempt.save();

  // Update quiz statistics
  await updateQuizStats(quiz._id);

  return attempt.toObject();
};

const updateQuizStats = async (quizId) => {
  const attempts = await QuizAttempt.find({
    quiz: quizId,
    status: "completed",
  });

  if (attempts.length === 0) return;

  const totalAttempts = attempts.length;
  const averageScore =
    attempts.reduce((sum, a) => sum + a.score.percentage, 0) / totalAttempts;
  const averageTime =
    attempts.reduce((sum, a) => sum + a.timeSpent, 0) / totalAttempts;
  const completionRate =
    (attempts.filter((a) => a.passed).length / totalAttempts) * 100;

  await Quiz.findByIdAndUpdate(quizId, {
    $set: {
      "stats.totalAttempts": totalAttempts,
      "stats.averageScore": Math.round(averageScore * 100) / 100,
      "stats.averageTime": Math.round(averageTime),
      "stats.completionRate": Math.round(completionRate * 100) / 100,
    },
  });
};

export const getUserAttempts = async ({
  quizId,
  userId,
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  const total = await QuizAttempt.countDocuments({
    quiz: quizId,
    user: userId,
  });

  const attempts = await QuizAttempt.find({
    quiz: quizId,
    user: userId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    attempts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAttemptById = async (attemptId, userId) => {
  const attempt = await QuizAttempt.findOne({
    _id: attemptId,
    user: userId,
  })
    .populate("quiz", "title category difficulty settings")
    .lean();

  return attempt;
};

export const getAllUserAttempts = async ({
  userId,
  page = 1,
  limit = 10,
  status,
}) => {
  const skip = (page - 1) * limit;

  const query = { user: userId };
  if (status) query.status = status;

  const total = await QuizAttempt.countDocuments(query);

  const attempts = await QuizAttempt.find(query)
    .populate("quiz", "title category difficulty thumbnail")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    attempts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get user quiz attempt statistics
export const getUserQuizAttemptStats = async (userId) => {
  const stats = await QuizAttempt.aggregate([
    { $match: { user: new ObjectId(userId), status: "completed" } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        totalQuizzes: { $addToSet: "$quiz" },
        totalPassed: { $sum: { $cond: ["$passed", 1, 0] } },
        totalFailed: { $sum: { $cond: ["$passed", 0, 1] } },
        averageScore: { $avg: "$score.percentage" },
        averageTimeSpent: { $avg: "$timeSpent" },
        totalCorrectAnswers: { $sum: "$correctAnswers" },
        totalWrongAnswers: { $sum: "$wrongAnswers" },
        totalSkippedAnswers: { $sum: "$skippedAnswers" },
        bestScore: { $max: "$score.percentage" },
        worstScore: { $min: "$score.percentage" },
      },
    },
    {
      $project: {
        _id: 0,
        totalAttempts: 1,
        totalQuizzes: { $size: "$totalQuizzes" },
        totalPassed: 1,
        totalFailed: 1,
        passRate: {
          $cond: [
            { $eq: ["$totalAttempts", 0] },
            0,
            {
              $multiply: [{ $divide: ["$totalPassed", "$totalAttempts"] }, 100],
            },
          ],
        },
        averageScore: { $round: ["$averageScore", 1] },
        averageTimeSpent: { $round: ["$averageTimeSpent", 0] },
        totalCorrectAnswers: 1,
        totalWrongAnswers: 1,
        totalSkippedAnswers: 1,
        bestScore: { $round: ["$bestScore", 1] },
        worstScore: { $round: ["$worstScore", 1] },
      },
    },
  ]);

  // Get recent activity
  const recentActivity = await QuizAttempt.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("quiz", "title category difficulty")
    .lean();

  // Get category performance
  const categoryPerformance = await QuizAttempt.aggregate([
    { $match: { user: new ObjectId(userId), status: "completed" } },
    {
      $group: {
        _id: "$quizSnapshot.category",
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: "$score.percentage" },
        totalPassed: { $sum: { $cond: ["$passed", 1, 0] } },
      },
    },
    {
      $project: {
        category: "$_id",
        _id: 0,
        totalAttempts: 1,
        averageScore: { $round: ["$averageScore", 1] },
        passRate: {
          $cond: [
            { $eq: ["$totalAttempts", 0] },
            0,
            {
              $multiply: [{ $divide: ["$totalPassed", "$totalAttempts"] }, 100],
            },
          ],
        },
      },
    },
    { $sort: { totalAttempts: -1 } },
  ]);

  return {
    summary:
      stats.length > 0
        ? stats[0]
        : {
            totalAttempts: 0,
            totalQuizzes: 0,
            totalPassed: 0,
            totalFailed: 0,
            passRate: 0,
            averageScore: 0,
            averageTimeSpent: 0,
            totalCorrectAnswers: 0,
            totalWrongAnswers: 0,
            totalSkippedAnswers: 0,
            bestScore: 0,
            worstScore: 0,
          },
    recentActivity,
    categoryPerformance,
  };
};

// Get statistics for a specific quiz attempt
export const getQuizAttemptStats = async (attemptId) => {
  const attempt = await QuizAttempt.findById(attemptId)
    .populate("quiz", "title category difficulty settings questions")
    .lean();

  if (!attempt) {
    throw new Error("Quiz attempt not found");
  }

  // Calculate time spent per question
  const timePerQuestion = attempt.answers.map((answer) => ({
    questionId: answer.questionId,
    question: answer.question,
    timeTaken: answer.timeTaken,
    isCorrect: answer.isCorrect,
  }));

  // Calculate performance by question difficulty
  const difficultyPerformance = {};

  if (attempt.quiz && attempt.quiz.questions) {
    attempt.quiz.questions.forEach((question) => {
      const answer = attempt.answers.find(
        (a) => a.questionId.toString() === question._id.toString()
      );
      if (answer) {
        if (!difficultyPerformance[question.difficulty]) {
          difficultyPerformance[question.difficulty] = {
            total: 0,
            correct: 0,
            percentage: 0,
          };
        }

        difficultyPerformance[question.difficulty].total++;
        if (answer.isCorrect) {
          difficultyPerformance[question.difficulty].correct++;
        }
      }
    });

    // Calculate percentages
    Object.keys(difficultyPerformance).forEach((difficulty) => {
      const stats = difficultyPerformance[difficulty];
      stats.percentage =
        stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    });
  }

  return {
    attemptSummary: {
      score: attempt.score,
      timeSpent: attempt.timeSpent,
      correctAnswers: attempt.correctAnswers,
      wrongAnswers: attempt.wrongAnswers,
      skippedAnswers: attempt.skippedAnswers,
      passed: attempt.passed,
      status: attempt.status,
    },
    timePerQuestion,
    difficultyPerformance,
  };
};
