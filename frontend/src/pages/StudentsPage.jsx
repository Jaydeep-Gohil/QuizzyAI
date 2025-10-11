import React, { useEffect } from "react";
import { Search } from "lucide-react";
import { useApp } from "../context/AppContext";

const StudentsPage = () => {
  const { getDashboardStats, studentData } = useApp();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        await getDashboardStats();
      } catch (error) {
        console.error("Error fetching student stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Sort students by totalPoints in descending order (highest first)
  const students =
    studentData?.data?.students
      ?.slice() // clone array (avoid mutating original)
      ?.sort(
        (a, b) =>
          (b.quizStats?.totalPoints || 0) - (a.quizStats?.totalPoints || 0)
      ) || [];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
            <p className="text-gray-400">
              Manage your students and track their quiz performance
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Student Directory</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search students..."
                  className="pl-10 pr-4 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Quizzes Taken</th>
                  <th className="pb-3 font-medium">Average Score</th>
                  <th className="pb-3 font-medium">Points</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b border-gray-700/50 hover:bg-gray-900/50"
                    >
                      {/* Name */}
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold">
                            {student.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <span className="text-white font-medium">
                            {student.name}
                          </span>
                        </div>
                      </td>

                      {/* Quizzes Taken */}
                      <td className="py-4">
                        {student.quizStats?.completedAttempts || 0}
                      </td>

                      {/* Average Score */}
                      <td className="py-4 text-white font-semibold">
                        {student.quizStats?.averageScore?.toFixed(2) || 0}%
                      </td>

                      {/* Points */}
                      <td className="py-4 text-pink-400 font-semibold">
                        {student.quizStats?.totalPoints || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-400 italic"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
