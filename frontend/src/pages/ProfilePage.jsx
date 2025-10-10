import React from 'react';
import { User, Mail, Calendar, Award, BookOpen, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useQuiz } from '../context/QuizContext';

const ProfilePage = () => {
  const { currentUser } = useApp();
  const { quizzes } = useQuiz();

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{currentUser?.name || 'User'}</h1>
                <p className="text-gray-400">{currentUser?.email}</p>
                <p className="text-gray-500 capitalize">{currentUser?.role || 'Student'}</p>
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
                  <div className="text-gray-400 text-sm">{currentUser?.isVerified ? 'Verified' : 'Unverified'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="text-purple-400" size={20} />
                <div>
                  <div className="text-white font-semibold">Member Since</div>
                  <div className="text-gray-400 text-sm">
                    {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Quiz Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-purple-400" size={20} />
                    <span className="text-gray-400">Quizzes Taken</span>
                  </div>
                  <span className="text-white font-bold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="text-green-400" size={20} />
                    <span className="text-gray-400">Average Score</span>
                  </div>
                  <span className="text-white font-bold">N/A</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-400" size={20} />
                    <span className="text-gray-400">Total Time</span>
                  </div>
                  <span className="text-white font-bold">0 min</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
              <div className="space-y-3">
                <div className="text-gray-400 text-sm">No recent activity</div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
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
