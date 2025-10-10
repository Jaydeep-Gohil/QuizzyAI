import Quiz from "../models/quiz.model.js";

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

// List quizzes (optional filters)
export const listQuizzes = async ({ page = 1, limit = 10, ...filters }) => {
  const skip = (page - 1) * limit;
  const total = await Quiz.countDocuments(filters);

  const quizzes = await Quiz.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    quizzes: quizzes.map((q) => q.toObject()),
  };
};

// Fetch only AI-generated quizzes
export const listAIQuizzes = async ({ page = 1, limit = 10, ...filters }) => {
  const skip = (page - 1) * limit;

  // Always include AI filter
  const query = { ...filters, isAI: true };

  const total = await Quiz.countDocuments(query);

  const quizzes = await Quiz.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit),
    quizzes: quizzes.map((q) => q.toObject()),
  };
};
