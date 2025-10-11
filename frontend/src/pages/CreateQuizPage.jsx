import React, { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Link,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createManualQuiz, createAIQuiz } from "../services/quiz.service";
import { useQuiz } from "../context/QuizContext";

const CreateQuizPage = () => {
  const navigate = useNavigate();
  const { fetchQuizzes } = useQuiz();
  const [quizType, setQuizType] = useState("manual"); // 'manual' or 'ai'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Manual Quiz Form State
  const [manualQuiz, setManualQuiz] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    difficulty: "easy",
    studyMaterial: {
      content: "",
      readingTime: 20,
      keyPoints: [""],
      resources: [{ title: "", url: "", type: "article" }],
    },
    questions: [
      {
        type: "mcq",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        explanation: "",
        difficulty: "easy",
        points: 5,
      },
    ],
    settings: {
      timeLimit: 30,
    },
    tags: [""],
    thumbnail: "",
  });

  // AI Generation Form State
  const [aiQuiz, setAiQuiz] = useState({
    prompt: "",
    numberOfQuestions: 10,
    difficulty: "medium",
    questionType: "mcq",
    category: "Programming",
    timeLimit: 30,
  });

  const handleManualQuizChange = (
    field,
    value,
    questionIndex = null,
    optionIndex = null
  ) => {
    if (questionIndex !== null) {
      if (optionIndex !== null) {
        const newQuestions = [...manualQuiz.questions];
        newQuestions[questionIndex].options[optionIndex] = value;
        setManualQuiz({ ...manualQuiz, questions: newQuestions });
      } else {
        const newQuestions = [...manualQuiz.questions];
        newQuestions[questionIndex][field] = value;
        setManualQuiz({ ...manualQuiz, questions: newQuestions });
      }
    } else if (field.startsWith("studyMaterial.")) {
      const studyMaterialField = field.split(".")[1];
      setManualQuiz({
        ...manualQuiz,
        studyMaterial: {
          ...manualQuiz.studyMaterial,
          [studyMaterialField]: value,
        },
      });
    } else if (field.startsWith("settings.")) {
      const settingsField = field.split(".")[1];
      setManualQuiz({
        ...manualQuiz,
        settings: {
          ...manualQuiz.settings,
          [settingsField]: value,
        },
      });
    } else {
      setManualQuiz({ ...manualQuiz, [field]: value });
    }
  };

  const handleAiQuizChange = (field, value) => {
    setAiQuiz({ ...aiQuiz, [field]: value });
  };

  const addQuestion = () => {
    const newQuestionIndex = manualQuiz.questions.length;
    setManualQuiz({
      ...manualQuiz,
      questions: [
        ...manualQuiz.questions,
        {
          type: "mcq",
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
          difficulty: "easy",
          points: 5,
        },
      ],
    });
    setCurrentQuestionIndex(newQuestionIndex);
  };

  const removeQuestion = (index) => {
    if (manualQuiz.questions.length > 1) {
      const newQuestions = manualQuiz.questions.filter((_, i) => i !== index);
      setManualQuiz({ ...manualQuiz, questions: newQuestions });
      
      // Adjust current question index if needed
      if (currentQuestionIndex >= newQuestions.length) {
        setCurrentQuestionIndex(newQuestions.length - 1);
      } else if (currentQuestionIndex > index) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
  };

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const navigateToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const navigateToNextQuestion = () => {
    if (currentQuestionIndex < manualQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const addKeyPoint = () => {
    setManualQuiz({
      ...manualQuiz,
      studyMaterial: {
        ...manualQuiz.studyMaterial,
        keyPoints: [...manualQuiz.studyMaterial.keyPoints, ""],
      },
    });
  };

  const removeKeyPoint = (index) => {
    const newKeyPoints = manualQuiz.studyMaterial.keyPoints.filter(
      (_, i) => i !== index
    );
    setManualQuiz({
      ...manualQuiz,
      studyMaterial: {
        ...manualQuiz.studyMaterial,
        keyPoints: newKeyPoints,
      },
    });
  };

  const addResource = () => {
    setManualQuiz({
      ...manualQuiz,
      studyMaterial: {
        ...manualQuiz.studyMaterial,
        resources: [
          ...manualQuiz.studyMaterial.resources,
          { title: "", url: "", type: "article" },
        ],
      },
    });
  };

  const removeResource = (index) => {
    const newResources = manualQuiz.studyMaterial.resources.filter(
      (_, i) => i !== index
    );
    setManualQuiz({
      ...manualQuiz,
      studyMaterial: {
        ...manualQuiz.studyMaterial,
        resources: newResources,
      },
    });
  };

  const addTag = () => {
    setManualQuiz({
      ...manualQuiz,
      tags: [...manualQuiz.tags, ""],
    });
  };

  const removeTag = (index) => {
    const newTags = manualQuiz.tags.filter((_, i) => i !== index);
    setManualQuiz({ ...manualQuiz, tags: newTags });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      if (quizType === "manual") {
        // Process manual quiz data
        const processedQuiz = {
          ...manualQuiz,
          studyMaterial: {
            ...manualQuiz.studyMaterial,
            keyPoints: manualQuiz.studyMaterial.keyPoints.filter(
              (point) => point.trim() !== ""
            ),
            resources: manualQuiz.studyMaterial.resources.filter(
              (resource) =>
                resource.title.trim() !== "" && resource.url.trim() !== ""
            ),
          },
          questions: manualQuiz.questions.map((q) => ({
            ...q,
            options: q.options.filter((option) => option.trim() !== ""),
          })),
          tags: manualQuiz.tags.filter((tag) => tag.trim() !== ""),
        };

        console.log("Manual Quiz Data:", processedQuiz);
        const result = await createManualQuiz(processedQuiz);
        console.log("Quiz created successfully:", result);
        setSuccess(true);

        // Refresh quiz list
        await fetchQuizzes();

        // Navigate back to quizzes page after a short delay
        setTimeout(() => {
          navigate("/quizzes");
        }, 1500);
      } else {
        // Process AI quiz data
        console.log("AI Quiz Data:", aiQuiz);
        const result = await createAIQuiz(aiQuiz);
        console.log("AI Quiz created successfully:", result);
        setSuccess(true);

        // Refresh quiz list
        await fetchQuizzes();

        // Navigate back to quizzes page after a short delay
        setTimeout(() => {
          navigate("/quizzes");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create quiz. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/quizzes")}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="text-gray-400" size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create New Quiz
            </h1>
            <p className="text-gray-400">
              Choose how you want to create your quiz
            </p>
          </div>
        </div>

        {/* Quiz Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              quizType === "manual"
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
            onClick={() => setQuizType("manual")}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <BookOpen className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">Manual Quiz</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Create a quiz manually with full control over questions, answers,
              and content.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              <span>More time required</span>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
              quizType === "ai"
                ? "border-purple-500 bg-purple-500/10"
                : "border-gray-700 bg-gray-800 hover:border-gray-600"
            }`}
            onClick={() => setQuizType("ai")}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Sparkles className="text-pink-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">
                AI Generation
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Let AI generate quiz questions based on your topic and
              preferences.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Star size={16} />
              <span>Quick and easy</span>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg">
            <div className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium">
                Quiz created successfully! Redirecting...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
            <div className="flex items-center gap-2 text-red-400">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 rounded-xl p-6 border border-gray-700"
        >
          {quizType === "manual" ? (
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={manualQuiz.title}
                      onChange={(e) =>
                        handleManualQuizChange("title", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter quiz title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category *
                    </label>
                    <input
                      type="text"
                      value={manualQuiz.category}
                      onChange={(e) =>
                        handleManualQuizChange("category", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Music, Programming"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Subcategory
                    </label>
                    <input
                      type="text"
                      value={manualQuiz.subcategory}
                      onChange={(e) =>
                        handleManualQuizChange("subcategory", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="e.g., Theory, Basics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty *
                    </label>
                    <select
                      value={manualQuiz.difficulty}
                      onChange={(e) =>
                        handleManualQuizChange("difficulty", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      required
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={manualQuiz.description}
                    onChange={(e) =>
                      handleManualQuizChange("description", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    rows={3}
                    placeholder="Describe what this quiz covers"
                    required
                  />
                </div>
              </div>

              {/* Study Material */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Study Material
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Content (Markdown)
                    </label>
                    <textarea
                      value={manualQuiz.studyMaterial.content}
                      onChange={(e) =>
                        handleManualQuizChange(
                          "studyMaterial.content",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      rows={4}
                      placeholder="## Music Basics&#10;Notes, Scales, Rhythm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Reading Time (minutes)
                      </label>
                      <input
                        type="number"
                        value={manualQuiz.studyMaterial.readingTime}
                        onChange={(e) =>
                          handleManualQuizChange(
                            "studyMaterial.readingTime",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Thumbnail URL
                      </label>
                      <input
                        type="url"
                        value={manualQuiz.thumbnail}
                        onChange={(e) =>
                          handleManualQuizChange("thumbnail", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {/* Key Points */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Key Points
                    </label>
                    {manualQuiz.studyMaterial.keyPoints.map((point, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={point}
                          onChange={(e) => {
                            const newKeyPoints = [
                              ...manualQuiz.studyMaterial.keyPoints,
                            ];
                            newKeyPoints[index] = e.target.value;
                            setManualQuiz({
                              ...manualQuiz,
                              studyMaterial: {
                                ...manualQuiz.studyMaterial,
                                keyPoints: newKeyPoints,
                              },
                            });
                          }}
                          className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                          placeholder="Enter key point"
                        />
                        <button
                          type="button"
                          onClick={() => removeKeyPoint(index)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addKeyPoint}
                      className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:bg-purple-500/20 rounded-lg"
                    >
                      <Plus size={16} />
                      Add Key Point
                    </button>
                  </div>

                  {/* Resources */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Resources
                    </label>
                    {manualQuiz.studyMaterial.resources.map(
                      (resource, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2"
                        >
                          <input
                            type="text"
                            value={resource.title}
                            onChange={(e) => {
                              const newResources = [
                                ...manualQuiz.studyMaterial.resources,
                              ];
                              newResources[index].title = e.target.value;
                              setManualQuiz({
                                ...manualQuiz,
                                studyMaterial: {
                                  ...manualQuiz.studyMaterial,
                                  resources: newResources,
                                },
                              });
                            }}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder="Resource title"
                          />
                          <input
                            type="url"
                            value={resource.url}
                            onChange={(e) => {
                              const newResources = [
                                ...manualQuiz.studyMaterial.resources,
                              ];
                              newResources[index].url = e.target.value;
                              setManualQuiz({
                                ...manualQuiz,
                                studyMaterial: {
                                  ...manualQuiz.studyMaterial,
                                  resources: newResources,
                                },
                              });
                            }}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                            placeholder="https://example.com"
                          />
                          <div className="flex gap-2">
                            <select
                              value={resource.type}
                              onChange={(e) => {
                                const newResources = [
                                  ...manualQuiz.studyMaterial.resources,
                                ];
                                newResources[index].type = e.target.value;
                                setManualQuiz({
                                  ...manualQuiz,
                                  studyMaterial: {
                                    ...manualQuiz.studyMaterial,
                                    resources: newResources,
                                  },
                                });
                              }}
                              className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                            >
                              <option value="article">Article</option>
                              <option value="video">Video</option>
                              <option value="documentation">
                                Documentation
                              </option>
                            </select>
                            <button
                              type="button"
                              onClick={() => removeResource(index)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={addResource}
                      className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:bg-purple-500/20 rounded-lg"
                    >
                      <Plus size={16} />
                      Add Resource
                    </button>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Questions ({manualQuiz.questions.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus size={16} />
                    Add Question
                  </button>
                </div>

                {/* Question Navigation Sidebar */}
                {manualQuiz.questions.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={navigateToPreviousQuestion}
                          disabled={currentQuestionIndex === 0}
                          className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <span className="text-gray-300 text-sm">
                          Question {currentQuestionIndex + 1} of {manualQuiz.questions.length}
                        </span>
                        <button
                          type="button"
                          onClick={navigateToNextQuestion}
                          disabled={currentQuestionIndex === manualQuiz.questions.length - 1}
                          className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => removeQuestion(currentQuestionIndex)}
                          disabled={manualQuiz.questions.length <= 1}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Question Navigation Dots */}
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                      {manualQuiz.questions.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => navigateToQuestion(index)}
                          className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                            index === currentQuestionIndex
                              ? "bg-purple-600 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Current Question Details */}
                {manualQuiz.questions.length > 0 && (
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-lg font-medium text-white">
                        Question {currentQuestionIndex + 1} Details
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Eye size={16} />
                        <span>Editing Mode</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Question *
                        </label>
                        <textarea
                          value={manualQuiz.questions[currentQuestionIndex].question}
                          onChange={(e) =>
                            handleManualQuizChange(
                              "question",
                              e.target.value,
                              currentQuestionIndex
                            )
                          }
                          className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                          rows={3}
                          placeholder="Enter your question"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Type
                          </label>
                          <select
                            value={manualQuiz.questions[currentQuestionIndex].type}
                            onChange={(e) =>
                              handleManualQuizChange(
                                "type",
                                e.target.value,
                                currentQuestionIndex
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                          >
                            <option value="mcq">Multiple Choice</option>
                            <option value="boolean">True/False</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Difficulty
                          </label>
                          <select
                            value={manualQuiz.questions[currentQuestionIndex].difficulty}
                            onChange={(e) =>
                              handleManualQuizChange(
                                "difficulty",
                                e.target.value,
                                currentQuestionIndex
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Points
                          </label>
                          <input
                            type="number"
                            value={manualQuiz.questions[currentQuestionIndex].points}
                            onChange={(e) =>
                              handleManualQuizChange(
                                "points",
                                parseInt(e.target.value),
                                currentQuestionIndex
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Correct Answer *
                          </label>
                          <input
                            type="text"
                            value={manualQuiz.questions[currentQuestionIndex].correctAnswer}
                            onChange={(e) =>
                              handleManualQuizChange(
                                "correctAnswer",
                                e.target.value,
                                currentQuestionIndex
                              )
                            }
                            className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                            placeholder="Enter correct answer"
                            required
                          />
                        </div>
                      </div>

                      {manualQuiz.questions[currentQuestionIndex].type === "mcq" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Options *
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {manualQuiz.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    handleManualQuizChange(
                                      "options",
                                      e.target.value,
                                      currentQuestionIndex,
                                      optionIndex
                                    )
                                  }
                                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                                  placeholder={`Option ${optionIndex + 1}`}
                                  required
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Explanation
                        </label>
                        <textarea
                          value={manualQuiz.questions[currentQuestionIndex].explanation}
                          onChange={(e) =>
                            handleManualQuizChange(
                              "explanation",
                              e.target.value,
                              currentQuestionIndex
                            )
                          }
                          className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                          rows={3}
                          placeholder="Explain why this is the correct answer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Settings */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  Quiz Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={manualQuiz.settings.timeLimit}
                      onChange={(e) =>
                        handleManualQuizChange(
                          "settings.timeLimit",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      min="60"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tags
                </label>
                {manualQuiz.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => {
                        const newTags = [...manualQuiz.tags];
                        newTags[index] = e.target.value;
                        setManualQuiz({ ...manualQuiz, tags: newTags });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTag}
                  className="flex items-center gap-2 px-4 py-2 text-purple-400 hover:bg-purple-500/20 rounded-lg"
                >
                  <Plus size={16} />
                  Add Tag
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                AI Quiz Generation
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Topic/Prompt *
                </label>
                <textarea
                  value={aiQuiz.prompt}
                  onChange={(e) => handleAiQuizChange("prompt", e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                  rows={3}
                  placeholder="Describe the topic for your quiz (e.g., 'Node.js fundamentals', 'JavaScript ES6 features')"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Number of Questions *
                  </label>
                  <input
                    type="number"
                    value={aiQuiz.numberOfQuestions}
                    onChange={(e) =>
                      handleAiQuizChange(
                        "numberOfQuestions",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    min="1"
                    max="50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time Limit (minutes) *
                  </label>
                  <input
                    type="number"
                    value={aiQuiz.timeLimit}
                    onChange={(e) =>
                      handleAiQuizChange("timeLimit", parseInt(e.target.value))
                    }
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    min="5"
                    max="180"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty *
                  </label>
                  <select
                    value={aiQuiz.difficulty}
                    onChange={(e) =>
                      handleAiQuizChange("difficulty", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Question Type *
                  </label>
                  <select
                    value={aiQuiz.questionType}
                    onChange={(e) =>
                      handleAiQuizChange("questionType", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="boolean">True/False</option>
                    <option value="mix">Mixed Types</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    value={aiQuiz.category}
                    onChange={(e) =>
                      handleAiQuizChange("category", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                    placeholder="e.g., Programming, Music, Science"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={() => navigate("/quizzes")}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating..."
                : `Create ${quizType === "manual" ? "Manual" : "AI"} Quiz`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizPage;
