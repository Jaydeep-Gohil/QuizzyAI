import React from 'react';
import { ChevronRight, BookOpen, Clock, Users, Award, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useQuiz } from '../context/QuizContext';

const QuizDetailPage = () => {
  const { selectedQuiz } = useApp();
  const { startQuiz, loading } = useQuiz();
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    if (!selectedQuiz) return;
    
    try {
      await startQuiz(selectedQuiz);
      navigate('/take-quiz');
    } catch (error) {
      console.error('Failed to start quiz:', error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <button onClick={() => navigate('/quizzes')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ChevronRight size={20} className="rotate-180" />
          Back
        </button>

        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{selectedQuiz?.title || 'Quiz Details'}</h1>
            <p className="text-gray-400">{selectedQuiz?.description || 'Explore the quiz details and get started.'}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 flex items-center gap-2">
              Edit
            </button>
            <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 flex items-center gap-2">
              Share
            </button>
            <button 
              onClick={handleStartQuiz}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
            >
              <Play size={20} />
              {loading ? 'Starting...' : 'Start Quiz'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Questions</span>
              <BookOpen className="text-purple-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white">{selectedQuiz?.questions?.length || 0}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Time Limit</span>
              <Clock className="text-green-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white">
              {selectedQuiz?.settings?.timeLimit ? `${selectedQuiz.settings.timeLimit} min` : 'No limit'}
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Difficulty</span>
              <Users className="text-blue-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white capitalize">{selectedQuiz?.difficulty || 'Medium'}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Passing Score</span>
              <Award className="text-orange-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white">
              {selectedQuiz?.settings?.passingScore ? `${selectedQuiz.settings.passingScore}%` : '60%'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Quiz Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Category</h3>
                <p className="text-gray-400 capitalize">{selectedQuiz?.category || 'General'}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Description</h3>
                <p className="text-gray-400">{selectedQuiz?.description || 'No description provided.'}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Instructions</h3>
                <ul className="text-gray-400 space-y-1">
                  <li>• Read each question carefully</li>
                  <li>• Select the best answer from the options</li>
                  <li>• You can navigate between questions</li>
                  <li>• Submit your answers when you're ready</li>
                  {selectedQuiz?.settings?.timeLimit && (
                    <li>• Time limit: {selectedQuiz.settings.timeLimit} minutes</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Quiz Statistics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Total Attempts</span>
                  <span className="text-white font-semibold">{selectedQuiz?.stats?.totalAttempts || 0}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Average Score</span>
                  <span className="text-white font-semibold">
                    {selectedQuiz?.stats?.averageScore ? `${selectedQuiz.stats.averageScore}%` : 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Completion Rate</span>
                  <span className="text-white font-semibold">
                    {selectedQuiz?.stats?.completionRate ? `${selectedQuiz.stats.completionRate}%` : 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-400 text-sm">Average Time</span>
                  <span className="text-white font-semibold">
                    {selectedQuiz?.stats?.averageTime ? `${Math.round(selectedQuiz.stats.averageTime / 60)} min` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Ready to Start?</h2>
          <p className="text-gray-400 mb-4">
            This quiz contains {selectedQuiz?.questions?.length || 0} questions. 
            {selectedQuiz?.settings?.timeLimit && ` You have ${selectedQuiz.settings.timeLimit} minutes to complete it.`}
          </p>
          <button 
            onClick={handleStartQuiz}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={20} />
            {loading ? 'Starting Quiz...' : 'Start Quiz Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;
