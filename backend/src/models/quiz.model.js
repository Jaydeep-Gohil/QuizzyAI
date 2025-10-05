import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    type: { type: String, enum: ["article", "video", "documentation"] },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["mcq", "boolean"], required: true },
    question: { type: String, required: true },
    options: { type: [String], default: [] }, // only for MCQ
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    points: { type: Number, default: 10 },
    tags: [String],
    hint: String,
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    description: { type: String },
    category: { type: String, required: true, index: true },
    subcategory: { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], index: true },

    studyMaterial: {
      content: String,
      readingTime: Number,
      keyPoints: [String],
      resources: [optionSchema],
    },

    questions: [questionSchema],

    settings: {
      timeLimit: { type: Number, required: true },
      timePerQuestion: { type: Number },
      shuffleQuestions: { type: Boolean, default: true },
      shuffleOptions: { type: Boolean, default: true },
      showExplanations: { type: Boolean, default: true },
      passingScore: { type: Number, default: 60 },
      attemptsAllowed: { type: Number, default: -1 },
      isPublic: { type: Boolean, default: true },
    },

    isAI: { type: Boolean, default: false },
    aiGenerationData: {
      prompt: String,
      model: String,
      generatedAt: Date,
      tokensUsed: Number,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    stats: {
      totalAttempts: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      averageTime: { type: Number, default: 0 },
      completionRate: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      totalRatings: { type: Number, default: 0 },
    },

    tags: { type: [String], index: true },
    thumbnail: String,
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    publishedAt: Date,
  },
  { timestamps: true }
);

// Indexes
quizSchema.index({ title: "text", description: "text" });
quizSchema.index({ category: 1, difficulty: 1 });
quizSchema.index({ "stats.totalAttempts": -1 });

const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default Quiz;
