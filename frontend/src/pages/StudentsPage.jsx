import React from "react";
import { Plus, Search } from "lucide-react";

const StudentsPage = () => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
            <p className="text-gray-400">
              Manage your students and track their progress
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
              <select className="px-4 py-2 bg-gray-900 text-gray-300 rounded-lg border border-gray-700">
                <option>Name</option>
              </select>
            </div>
          </div>

          {/* <div className="flex gap-2 mb-6">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
              All Students
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
              10A
            </button>
            <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600">
              10B
            </button>
          </div> */}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Class</th>
                  <th className="pb-3 font-medium">Quizzes Taken</th>
                  <th className="pb-3 font-medium">Average Score</th>
                  <th className="pb-3 font-medium">Last Active</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {[1, 2, 3, 4].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-700/50 hover:bg-gray-900/50"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                        <span className="text-white font-medium">
                          Alex Johnson
                        </span>
                      </div>
                    </td>
                    <td className="py-4">10A</td>
                    <td className="py-4">12</td>
                    <td className="py-4 text-white font-semibold">85%</td>
                    <td className="py-4 text-gray-400">2 hours ago</td>
                    <td className="py-4">
                      <button className="text-gray-400 hover:text-white">
                        •••
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
