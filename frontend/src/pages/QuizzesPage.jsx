import React, { useEffect, useState } from "react";
import { BookOpen, Plus, Search, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";

const QuizzesPage = () => {
  const { setSelectedQuiz, currentUser, setCurrentUser, bootstrap } = useApp();
  const { quizzes, loading, getAiQuiz, fetchQuizzes, getMannualQuiz } =
    useQuiz();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchStatsMyDetails = async () => {
      try {
        const res = await bootstrap();
        if (res?.success) {
          setCurrentUser(res);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };
    fetchStatsMyDetails();
  }, []);

  // ✅ Load appropriate quizzes when tab changes
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        if (activeTab === "ai") {
          await getAiQuiz();
        } else if (activeTab === "instructor") {
          await getMannualQuiz();
        } else {
          await fetchQuizzes();
        }
      } catch (err) {
        console.error("Error loading quizzes:", err);
      }
    };
    loadQuizzes();
  }, [activeTab]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Quizzes</h1>
            <p className="text-gray-400">
              Create, manage and analyze your quizzes
            </p>
          </div>
          {currentUser?.role === "instucture" && (
            <button
              onClick={() => navigate("/create-quiz")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2"
            >
              <Plus size={20} />
              Create New Quiz
            </button>
          )}
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {/* <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quiz Library</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  className="pl-10 pr-4 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
              <select className="px-4 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700">
                <option>All Categories</option>
              </select>
            </div>
          </div> */}

          {/* ✅ Filter tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              All Quizzes
            </button>
            <button
              onClick={() => setActiveTab("instructor")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "instructor"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Instructor Created
            </button>
            <button
              onClick={() => setActiveTab("ai")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === "ai"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              AI Generated
            </button>
          </div>

          {/* ✅ Quiz list with proper loading and empty states */}
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 mt-2">Loading quizzes...</p>
              </div>
            )}

            {!loading && quizzes.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 text-lg">No quizzes found</p>
                <p className="text-gray-500 text-sm mt-1">
                  {activeTab === "ai" &&
                    "No AI-generated quizzes available yet"}
                  {activeTab === "instructor" &&
                    "No instructor-created quizzes available yet"}
                  {activeTab === "all" && "Start by creating your first quiz"}
                </p>
              </div>
            )}

            {!loading &&
              quizzes.map((quiz) => (
                <div
                  key={quiz._id || quiz.id}
                  className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-purple-400" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold">
                          {quiz.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            quiz.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {quiz.status || "draft"}
                        </span>

                        {/* ✅ AI quiz badge - handles both isAI and isAi */}
                        {(quiz?.isAI || quiz?.isAi) && (
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                            AI
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen size={14} />
                          {quiz.questions?.length || 0} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {quiz.settings?.timeLimit
                            ? `${quiz.settings.timeLimit} min`
                            : "No limit"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {quiz.stats?.totalAttempts || 0} attempts
                        </span>
                        <span className="text-gray-500 capitalize">
                          {quiz.category || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      navigate("/quiz-detail");
                    }}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  >
                    View Quiz
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizzesPage;
