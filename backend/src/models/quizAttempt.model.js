import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    question: String,
    selectedAnswer: {
      type: String,
      required: true,
    },
    correctAnswer: String,
    isCorrect: {
      type: Boolean,
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    maxPoints: {
      type: Number,
      default: 10,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Quiz snapshot at time of attempt
    quizSnapshot: {
      title: String,
      category: String,
      difficulty: String,
      totalQuestions: Number,
      timeLimit: Number,
    },

    // Answers and responses
    answers: [answerSchema],

    // Scoring
    score: {
      obtained: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 },
    },

    // Timing
    timeSpent: {
      type: Number, // in seconds
      default: 0,
    },
    startedAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
    },

    // Status
    status: {
      type: String,
      enum: ["in-progress", "completed", "abandoned"],
      default: "in-progress",
      index: true,
    },

    // Results
    passed: {
      type: Boolean,
      default: false,
    },
    passingScore: {
      type: Number,
      default: 60,
    },

    // Statistics
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    skippedAnswers: { type: Number, default: 0 },

    // Additional data
    attemptNumber: {
      type: Number,
      default: 1,
    },
    ipAddress: String,
    userAgent: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
quizAttemptSchema.index({ quiz: 1, user: 1 });
quizAttemptSchema.index({ user: 1, status: 1 });
quizAttemptSchema.index({ quiz: 1, status: 1 });
quizAttemptSchema.index({ createdAt: -1 });

// Compound index for leaderboard queries
quizAttemptSchema.index({ quiz: 1, "score.percentage": -1 });

const QuizAttempt =
  mongoose.models.QuizAttempt ||
  mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;
