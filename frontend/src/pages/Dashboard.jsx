import React from 'react';
import { BookOpen, Calendar, Users, BarChart3, Plus, Clock, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { stats, events, topStudents, quizzes } from '../data/mockData';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, Sarah! Here's what's happening with your quizzes</p>
          </div>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
            <Plus size={20} />
            Create New Quiz
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<BookOpen size={24} />} title="Total Quizzes" value={stats.totalQuizzes} change="+12.5%" color="blue" />
          <StatCard icon={<Calendar size={24} />} title="Active Events" value={stats.activeEvents} change="+12.5%" color="green" />
          <StatCard icon={<Users size={24} />} title="Students" value={stats.students} change="+12.5%" color="purple" />
          <StatCard icon={<BarChart3 size={24} />} title="Avg. Completion" value={stats.avgCompletion} change="-12.5%" color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Recent Events</h2>
              <button className="text-purple-400 text-sm font-medium hover:text-purple-300">View All</button>
            </div>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="text-green-400" size={24} />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{event.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock size={14} />
                          {event.time}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Users size={14} />
                          {event.participants} participants
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg font-medium ${
                    event.status === 'Active' ? 'bg-purple-600 text-white' : 
                    event.status === 'Upcoming' ? 'bg-gray-700 text-white' : 
                    'bg-gray-700 text-gray-400'
                  }`}>
                    {event.status === 'Active' ? 'View Live' : 'Manage'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Top Students</h2>
            <div className="space-y-4">
              {topStudents.map((student, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{student.name}</div>
                    <div className="text-gray-400 text-sm">{student.subject}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="text-orange-400" size={18} />
                    <span className="text-orange-400 font-bold">{student.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Quizzes</h2>
            <button onClick={() => navigate('/quizzes')} className="text-purple-400 text-sm font-medium hover:text-purple-300">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.slice(0, 3).map(quiz => (
              <div key={quiz.id} className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-purple-400" size={20} />
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    quiz.status === 'Published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {quiz.status}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">{quiz.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {quiz.questions} questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {quiz.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">{quiz.completions} completions</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-700 rounded-full h-2 w-20">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: `${quiz.rate}%`}}></div>
                    </div>
                    <span className="text-white text-sm font-medium">{quiz.rate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 p-4 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-purple-500 transition-colors flex items-center justify-center gap-2">
            <Plus size={20} />
            Create New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
