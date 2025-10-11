import React, { useEffect } from "react";
import { BookOpen, Plus, Search, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";

const QuizzesPage = () => {
  const { setSelectedQuiz, currentUser, setCurrentUser, bootstrap } = useApp();
  const { quizzes, loading } = useQuiz();
  const navigate = useNavigate();

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
          {currentUser?.role == "instucture" && (
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
          <div className="flex items-center justify-between mb-6">
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
          </div>

          <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
              All Quizzes
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
              Instructure Created
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
              AI Created
            </button>
          </div>

          <div className="space-y-4">
            {loading && <div className="text-gray-400">Loading quizzes...</div>}
            {!loading && quizzes.length === 0 && (
              <div className="text-gray-400">No quizzes found.</div>
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
                            (quiz.status || "published") === "published"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {quiz.status || "published"}
                        </span>
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
                            : "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {quiz.stats?.totalAttempts || 0} completions
                        </span>
                        <span className="text-gray-500 capitalize">
                          {quiz.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      navigate("/quiz-detail");
                    }}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600"
                  >
                    View & Attempt Quiz
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
