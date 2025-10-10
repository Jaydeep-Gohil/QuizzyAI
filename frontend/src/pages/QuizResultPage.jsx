import React from 'react';
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, Home, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const QuizResultPage = () => {
  const navigate = useNavigate();
  const { quizResult, resetQuiz } = useQuiz();

  if (!quizResult) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Quiz Results Found</h2>
          <button 
            onClick={() => navigate('/quizzes')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90"
          >
            Go to Quizzes
          </button>
        </div>
      </div>
    );
  }

  const {
    score,
    correctAnswers,
    wrongAnswers,
    skippedAnswers,
    passed,
    timeSpent,
    quizSnapshot,
    answers,
    attemptNumber,
    completedAt
  } = quizResult;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
    navigate('/quizzes');
  };

  const handleViewDetails = () => {
    // Navigate to detailed results view
    navigate('/quiz-details');
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            passed ? 'bg-green-600' : 'bg-red-600'
          }`}>
            {passed ? <Trophy size={40} className="text-white" /> : <XCircle size={40} className="text-white" />}
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            {passed ? 'Congratulations!' : 'Better Luck Next Time!'}
          </h1>
          <p className="text-gray-400 text-lg">
            {passed ? 'You passed the quiz!' : 'You need to improve your score.'}
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">{quizSnapshot.title}</h2>
            <p className="text-gray-400">Attempt #{attemptNumber}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">{score.percentage}%</div>
              <div className="text-gray-400">Final Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">{correctAnswers}</div>
              <div className="text-gray-400">Correct Answers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">{wrongAnswers}</div>
              <div className="text-gray-400">Wrong Answers</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-400" />
              <div>
                <div className="text-white font-semibold">Time Taken</div>
                <div className="text-gray-400">{formatTime(timeSpent)}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-yellow-400" />
              <div>
                <div className="text-white font-semibold">Questions Answered</div>
                <div className="text-gray-400">{correctAnswers + wrongAnswers} / {quizSnapshot.totalQuestions}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          <h3 className="text-xl font-bold text-white mb-6">Question Review</h3>
          <div className="space-y-4">
            {answers.map((answer, index) => (
              <div key={index} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      answer.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {answer.isCorrect ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </div>
                    <span className="text-white font-semibold">Question {index + 1}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Points</div>
                    <div className={`font-bold ${answer.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {answer.points} / {answer.maxPoints}
                    </div>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-white font-medium mb-2">{answer.question}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Your Answer</div>
                    <div className={`p-2 rounded ${
                      answer.isCorrect ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                    }`}>
                      {answer.selectedAnswer}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Correct Answer</div>
                    <div className="p-2 rounded bg-gray-700 text-white">
                      {answer.correctAnswer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Info */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Quiz Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Category:</span>
              <span className="text-white ml-2">{quizSnapshot.category}</span>
            </div>
            <div>
              <span className="text-gray-400">Difficulty:</span>
              <span className="text-white ml-2">{quizSnapshot.difficulty}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Questions:</span>
              <span className="text-white ml-2">{quizSnapshot.totalQuestions}</span>
            </div>
            <div>
              <span className="text-gray-400">Time Limit:</span>
              <span className="text-white ml-2">{quizSnapshot.timeLimit ? formatTime(quizSnapshot.timeLimit) : 'No limit'}</span>
            </div>
            <div>
              <span className="text-gray-400">Passing Score:</span>
              <span className="text-white ml-2">{quizResult.passingScore}%</span>
            </div>
            <div>
              <span className="text-gray-400">Completed:</span>
              <span className="text-white ml-2">{formatDate(completedAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetakeQuiz}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <RotateCcw size={20} />
            Retake Quiz
          </button>
          <button
            onClick={() => navigate('/quizzes')}
            className="px-8 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Back to Quizzes
          </button>
          <button
            onClick={handleViewDetails}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <BarChart3 size={20} />
            View Detailed Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;
