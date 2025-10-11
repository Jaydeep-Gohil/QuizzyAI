import React, { useEffect, useState } from "react";
import { User, Mail, Calendar, Award, BookOpen, Clock } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useQuiz } from "../context/QuizContext";

const ProfilePage = () => {
  const { currentUser, getMyStatesMethod } = useApp();
  const { quizzes } = useQuiz();

  // ✅ Local state to store fetched stats
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getMyStatesMethod();
        if (res?.success) {
          setStats(res);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const summary = stats?.summary || {};
  const recentActivity = stats?.recentActivity || [];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* ---------- USER PROFILE ---------- */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {currentUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {currentUser?.name || "User"}
                </h1>
                <p className="text-gray-400">{currentUser?.email}</p>
                <p className="text-gray-500 capitalize">
                  {currentUser?.role || "Student"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <User className="text-blue-400" size={20} />
                <div>
                  <div className="text-white font-semibold">Profile</div>
                  <div className="text-gray-400 text-sm">Complete</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-green-400" size={20} />
                <div>
                  <div className="text-white font-semibold">Email</div>
                  <div className="text-gray-400 text-sm">
                    {currentUser?.isVerified ? "Verified" : "Unverified"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-purple-400" size={20} />
                <div>
                  <div className="text-white font-semibold">Member Since</div>
                  <div className="text-gray-400 text-sm">
                    {currentUser?.createdAt
                      ? new Date(currentUser.createdAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- QUIZ STATS ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">
                Quiz Statistics
              </h2>

              {loading ? (
                <div className="text-gray-400">Loading statistics...</div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="text-purple-400" size={20} />
                      <span className="text-gray-400">Quizzes Taken</span>
                    </div>
                    <span className="text-white font-bold">
                      {summary?.totalAttempts ?? 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="text-green-400" size={20} />
                      <span className="text-gray-400">Average Score</span>
                    </div>
                    <span className="text-white font-bold">
                      {summary?.averageScore
                        ? `${summary.averageScore}%`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="text-blue-400" size={20} />
                      <span className="text-gray-400">Total Time</span>
                    </div>
                    <span className="text-white font-bold">
                      {summary?.averageTimeSpent
                        ? `${summary.averageTimeSpent} min`
                        : "0 min"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="text-yellow-400" size={20} />
                      <span className="text-gray-400">Pass Rate</span>
                    </div>
                    <span className="text-white font-bold">
                      {summary?.passRate
                        ? `${summary.passRate.toFixed(1)}%`
                        : "0%"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="text-pink-400" size={20} />
                      <span className="text-gray-400">Total Points Earned</span>
                    </div>
                    <span className="text-white font-bold">
                      {summary?.totalPointsEarned ?? 0}
                      {console.log(summary)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ---------- RECENT ACTIVITY ---------- */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">
                Recent Activity
              </h2>

              {loading ? (
                <div className="text-gray-400">Loading activity...</div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-3">
                  {recentActivity.map((act, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-b border-gray-700 pb-2"
                    >
                      <div className="text-gray-300">
                        <div className="font-semibold text-white">
                          {act.quiz?.title || "Untitled Quiz"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(act.createdAt).toLocaleDateString()} •{" "}
                          {act.status}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-bold ${
                          act.passed ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {act.score?.percentage
                          ? `${act.score.percentage}%`
                          : "0%"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 text-sm">No recent activity</div>
              )}
            </div>
          </div>

          {/* ---------- ACCOUNT SETTINGS ---------- */}
          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">
              Account Settings
            </h2>
            <div className="space-y-4">
              <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-left">
                Change Password
              </button>
              <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-left">
                Update Profile Information
              </button>
              <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-left">
                Notification Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
