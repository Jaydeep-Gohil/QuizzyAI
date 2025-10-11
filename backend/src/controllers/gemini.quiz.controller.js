import asyncHandler from "../middlewares/async.middleware.js";
import { successResponse, errorResponse } from "../utils/responses.js";
import { createQuiz } from "../dao/quiz.dao.js";
import { GoogleGenAI } from "@google/genai";

import { listAIQuizzes } from "../dao/quiz.dao.js";

// Initialize Gemini AI
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// System prompt for quiz generation
const QUIZ_GENERATION_PROMPT = `You are an expert educational content creator specializing in generating high-quality quizzes. 

Your task is to generate a comprehensive quiz based on the user's requirements. Follow these guidelines strictly:

1. **Question Quality**: Create clear, unambiguous questions that test understanding, not just memorization
2. **Difficulty Levels**: 
   - Easy: Basic concepts and definitions
   - Medium: Application and analysis
   - Hard: Complex problem-solving and synthesis
3. **Question Types**:
   - MCQ: Provide exactly 4 options with only one correct answer
   - Boolean: True/False questions
4. **Explanations**: Provide detailed, educational explanations for each answer
5. **Point Distribution**: 
   - Easy: 10 points
   - Medium: 15 points
   - Hard: 20 points

**CRITICAL**: You MUST respond with ONLY a valid JSON object. No markdown, no code blocks, no explanations - just raw JSON.

The JSON structure MUST be:

{
  "title": "Quiz title (max 100 chars)",
  "description": "Brief description of the quiz",
  "category": "Main category",
  "subcategory": "Subcategory if applicable",
  "difficulty": "easy|medium|hard",
  "studyMaterial": {
    "content": "Comprehensive study material covering key concepts",
    "readingTime": 10,
    "keyPoints": ["point 1", "point 2", "point 3"],
    "resources": [
      {
        "title": "Resource title",
        "url": "https://example.com",
        "type": "article"
      }
    ]
  },
  "questions": [
    {
      "type": "mcq",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Detailed explanation why this is correct",
      "difficulty": "easy",
      "points": 10,
      "tags": ["tag1", "tag2"],
      "hint": "Optional hint"
    }
  ],
  "settings": {
    "timeLimit": 30,
    "timePerQuestion": 60,
    "shuffleQuestions": true,
    "shuffleOptions": true,
    "showExplanations": true,
    "passingScore": 60,
    "attemptsAllowed": -1,
    "isPublic": true
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Generate questions that:
- Are grammatically correct and professional
- Have realistic distractors (wrong options that seem plausible)
- Cover different aspects of the topic
- Progress logically in difficulty
- Include variety in question formats

REMEMBER: Return ONLY the JSON object, nothing else.`;

// Create AI-generated quiz
export const createAIQuiz = asyncHandler(async (req, res) => {
  const {
    prompt,
    numberOfQuestions = 10,
    difficulty = "medium",
    category,
    subcategory,
    questionType = "mix", // "mcq", "boolean", or "mix"
  } = req.body;

  console.log("📥 Request received:", {
    prompt: prompt?.substring(0, 50) + "...",
    numberOfQuestions,
    difficulty,
    questionType,
  });

  // Validation
  if (!prompt) {
    return errorResponse(res, 400, "AI prompt is required to generate quiz");
  }

  const validQuestionTypes = ["mcq", "boolean", "mix"];
  if (!validQuestionTypes.includes(questionType)) {
    return errorResponse(
      res,
      400,
      "Question type must be 'mcq', 'boolean', or 'mix'"
    );
  }

  try {
    // Determine question type instruction
    let questionTypeInstruction = "";
    switch (questionType) {
      case "mcq":
        questionTypeInstruction =
          "Generate ONLY Multiple Choice Questions (MCQ) with exactly 4 options each.";
        break;
      case "boolean":
        questionTypeInstruction =
          "Generate ONLY True/False (Boolean) questions with options ['True', 'False'].";
        break;
      case "mix":
        questionTypeInstruction = `Generate a balanced mix of Multiple Choice Questions (MCQ) and True/False questions. 
        Aim for approximately 60-70% MCQ and 30-40% Boolean questions.`;
        break;
    }

    // Create comprehensive user prompt
    const userPrompt = `
Generate a quiz with the following requirements:
- Topic: ${prompt}
- Number of questions: ${numberOfQuestions}
- Difficulty level: ${difficulty}
- Question Type: ${questionType.toUpperCase()}
${category ? `- Category: ${category}` : ""}
${subcategory ? `- Subcategory: ${subcategory}` : ""}

${questionTypeInstruction}

Create a comprehensive quiz that includes:
1. Study material to help learners prepare (minimum 200 words)
2. ${numberOfQuestions} well-crafted questions as per the type specified
3. Detailed explanations for each answer (minimum 50 words per explanation)
4. Appropriate time limits: ${req.body.timeLimit} in minutes
5. Relevant tags for discoverability (at least 5 tags)

Ensure the quiz is educational, engaging, and properly structured according to the JSON format specified.

IMPORTANT: Return ONLY the JSON object. No markdown formatting, no code blocks, no additional text.
`;

    console.log("🤖 Calling Gemini AI...");

    // Generate content using Gemini with JSON mode
    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: QUIZ_GENERATION_PROMPT + "\n\n" + userPrompt,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json", // Request JSON response
      },
    });

    console.log("✅ AI Response received");

    // Get the generated text
    const generatedText = result.text;

    if (!generatedText) {
      console.error("❌ No response text from AI");
      throw new Error("No response received from AI");
    }

    console.log("📄 Generated text length:", generatedText.length);

    // Parse JSON from response
    let quizData;
    try {
      // Clean the text (remove any potential markdown artifacts)
      let cleanedText = generatedText.trim();

      // Remove markdown code blocks if present
      if (cleanedText.startsWith("```")) {
        const match = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
          cleanedText = match[1].trim();
        }
      }

      // Parse JSON
      quizData = JSON.parse(cleanedText);
      console.log("✅ JSON parsed successfully");
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError.message);
      console.error(
        "Raw response (first 500 chars):",
        generatedText.substring(0, 500)
      );

      // Try alternative extraction methods
      try {
        const jsonStart = generatedText.indexOf("{");
        const jsonEnd = generatedText.lastIndexOf("}") + 1;

        if (jsonStart !== -1 && jsonEnd > jsonStart) {
          const extractedJson = generatedText.substring(jsonStart, jsonEnd);
          quizData = JSON.parse(extractedJson);
          console.log("✅ JSON extracted and parsed successfully");
        } else {
          throw new Error("Could not find JSON object in response");
        }
      } catch (extractError) {
        console.error("❌ JSON Extraction Error:", extractError.message);
        throw new Error(
          `Failed to parse AI response as JSON: ${parseError.message}`
        );
      }
    }

    // Validate quiz data structure
    console.log("🔍 Validating quiz data...");

    if (!quizData || typeof quizData !== "object") {
      throw new Error("AI response is not a valid object");
    }

    if (!quizData.title || typeof quizData.title !== "string") {
      throw new Error("Quiz title is missing or invalid");
    }

    if (!Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      throw new Error("Quiz questions are missing or invalid");
    }

    if (quizData.questions.length < numberOfQuestions) {
      console.warn(
        `⚠️ Warning: Requested ${numberOfQuestions} questions but got ${quizData.questions.length}`
      );
    }

    // Validate each question
    quizData.questions.forEach((q, index) => {
      if (!q.type || !["mcq", "boolean"].includes(q.type)) {
        throw new Error(`Question ${index + 1}: Invalid or missing type`);
      }

      if (!q.question || typeof q.question !== "string") {
        throw new Error(
          `Question ${index + 1}: Invalid or missing question text`
        );
      }

      if (!Array.isArray(q.options) || q.options.length === 0) {
        throw new Error(`Question ${index + 1}: Invalid or missing options`);
      }

      if (q.type === "mcq" && q.options.length !== 4) {
        console.warn(`⚠️ Question ${index + 1}: MCQ should have 4 options`);
      }

      if (q.type === "boolean" && q.options.length !== 2) {
        console.warn(`⚠️ Question ${index + 1}: Boolean should have 2 options`);
      }

      if (!q.correctAnswer) {
        throw new Error(`Question ${index + 1}: Missing correct answer`);
      }

      if (!q.options.includes(q.correctAnswer)) {
        throw new Error(
          `Question ${index + 1}: Correct answer not found in options`
        );
      }
    });

    // Validate question types match the requested type
    if (questionType !== "mix") {
      const matchingQuestions = quizData.questions.filter(
        (q) => q.type === questionType
      );
      const matchPercentage =
        (matchingQuestions.length / quizData.questions.length) * 100;

      console.log(
        `📊 Question type match: ${matchPercentage.toFixed(1)}% (${
          matchingQuestions.length
        }/${quizData.questions.length})`
      );

      if (matchPercentage < 80) {
        console.warn(
          `⚠️ Warning: Only ${matchPercentage.toFixed(
            1
          )}% questions match requested type '${questionType}'`
        );
      }
    }

    console.log("✅ Validation complete");

    // Ensure default values for optional fields
    quizData.category = quizData.category || category || "General";
    quizData.subcategory = quizData.subcategory || subcategory || "";
    quizData.difficulty = quizData.difficulty || difficulty;
    quizData.tags = Array.isArray(quizData.tags) ? quizData.tags : [];

    // Ensure settings exist with defaults
    quizData.settings = {
      timeLimit: quizData.settings?.timeLimit || numberOfQuestions * 2,
      timePerQuestion:
        quizData.settings?.timePerQuestion ||
        Math.floor((numberOfQuestions * 2 * 60) / numberOfQuestions),
      shuffleQuestions: quizData.settings?.shuffleQuestions ?? true,
      shuffleOptions: quizData.settings?.shuffleOptions ?? true,
      showExplanations: quizData.settings?.showExplanations ?? true,
      passingScore: quizData.settings?.passingScore || 60,
      attemptsAllowed: quizData.settings?.attemptsAllowed ?? -1,
      isPublic: quizData.settings?.isPublic ?? true,
    };

    // Ensure studyMaterial exists
    if (!quizData.studyMaterial) {
      quizData.studyMaterial = {
        content: "Study the questions carefully and review the explanations.",
        readingTime: 5,
        keyPoints: ["Review each question", "Understand the concepts"],
        resources: [],
      };
    }

    // Get usage metadata
    const tokensUsed = result.usageMetadata
      ? {
          promptTokens: result.usageMetadata.promptTokenCount || 0,
          completionTokens: result.usageMetadata.candidatesTokenCount || 0,
          totalTokens: result.usageMetadata.totalTokenCount || 0,
        }
      : null;

    console.log("📊 Token usage:", tokensUsed);

    // Prepare quiz data for database
    const quizToCreate = {
      title: quizData.title,
      description: quizData.description || `Quiz about ${prompt}`,
      category: quizData.category,
      subcategory: quizData.subcategory,
      difficulty: quizData.difficulty,
      studyMaterial: quizData.studyMaterial,
      questions: quizData.questions,
      settings: quizData.settings,
      tags: quizData.tags,
      thumbnail: quizData.thumbnail || null,
      isAI: true,
      aiGenerationData: {
        prompt: prompt,
        model: "gemini-2.0-flash-exp",
        generatedAt: new Date(),
        tokensUsed: tokensUsed?.totalTokens || 0,
        metadata: {
          numberOfQuestions,
          difficulty,
          questionType,
          category: category || quizData.category,
          subcategory: subcategory || quizData.subcategory,
          tokensUsed: tokensUsed,
        },
      },
      createdBy: req.user._id,
      status: "published",
      publishedAt: new Date(),
    };

    console.log("💾 Saving quiz to database...");

    // Create quiz in database
    const quiz = await createQuiz(quizToCreate);

    console.log("✅ Quiz created successfully:", quiz._id);

    return successResponse(
      res,
      201,
      quiz,
      "AI-generated quiz created successfully"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error("Stack:", error.stack);

    // Return detailed error for debugging
    return errorResponse(res, 500, {
      message: "Failed to generate quiz",
      error: error.message,
      details:
        process.env.NODE_ENV === "development"
          ? {
              stack: error.stack,
              timestamp: new Date().toISOString(),
            }
          : undefined,
    });
  }
});

export const getAIQuize = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, difficulty, tags } = req.query;

  const filters = {};
  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  if (tags) filters.tags = { $in: tags.split(",") };

  const result = await listAIQuizzes({
    page: parseInt(page),
    limit: parseInt(limit),
    ...filters,
  });

  if (!result || result.quizzes.length === 0) {
    return errorResponse(res, 404, "No quizzes found");
  }

  return successResponse(res, 200, result, "Quizzes listed successfully");
});
