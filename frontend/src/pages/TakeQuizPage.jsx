import React, { useState, useEffect } from 'react';
import { X, Clock, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';

const TakeQuizPage = () => {
  const navigate = useNavigate();
  const {
    currentQuiz,
    currentQuestionIndex,
    answers,
    timeRemaining,
    quizStarted,
    loading,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    handleSubmitQuiz,
    formatTime,
    getCurrentAnswer,
    resetQuiz
  } = useQuiz();

  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Reset selected answer when question changes
  useEffect(() => {
    if (currentQuiz && currentQuiz.questions[currentQuestionIndex]) {
      const currentAnswer = getCurrentAnswer(currentQuiz.questions[currentQuestionIndex]._id);
      setSelectedAnswer(currentAnswer?.selectedAnswer || '');
      setQuestionStartTime(Date.now());
    }
  }, [currentQuestionIndex, currentQuiz, getCurrentAnswer]);

  if (!currentQuiz || !quizStarted) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No Active Quiz</h2>
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

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;
  const answeredQuestions = answers.length;
  const remainingQuestions = currentQuiz.questions.length - answeredQuestions;

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    
    // Calculate time taken and submit immediately
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    submitAnswer(currentQuestion._id, answer, timeTaken);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer before proceeding.");
      return;
    }
    
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      nextQuestion();
    }
  };

  const handlePrevious = () => {
    previousQuestion();
  };

  const handleSubmit = async () => {
    if (!selectedAnswer) {
      alert("Please select an answer before submitting the quiz.");
      return;
    }

    // Changed MAX_COUNT from 9 to 10
    const MAX_COUNT = 10;

    // If this question wasn't previously answered, add it to count
    const alreadyAnswered = answers.find(a => a.questionId === currentQuestion._id);
    let totalAttempted = answeredQuestions + (alreadyAnswered ? 0 : 1);

    // Limit to 10
    if (totalAttempted > MAX_COUNT) totalAttempted = MAX_COUNT;

    const confirmed = window.confirm(
      `Are you sure you want to submit the quiz? Only your first ${MAX_COUNT} questions will be counted.\nYou have attempted ${totalAttempted} out of ${MAX_COUNT}.`
    );
    if (!confirmed) return;

    try {
      const data = await handleSubmitQuiz();
      console.log("Quiz submitted successfully:", data);
      navigate("/quiz-result");
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => { 
              resetQuiz(); 
              navigate('/quizzes'); 
            }} 
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">{currentQuiz.title}</h2>
          <div className="flex items-center gap-2 text-red-400">
            <Clock size={20} />
            <span className="text-xl font-bold">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
            <span className="text-white font-semibold">{Math.round(progress)}% Complete</span>
          </div>
          <div className="bg-gray-800 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300" 
              style={{width: `${progress}%`}}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">
                  {currentQuestion.points || 10} points
                </span>
                <span className="px-4 py-2 bg-gray-700 text-white rounded-lg">
                  {currentQuiz.difficulty}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(option)}
                    className={`p-6 rounded-xl transition-all text-left group ${
                      selectedAnswer === option
                        ? 'bg-purple-600 border-2 border-purple-500'
                        : 'bg-gray-900 border-2 border-gray-700 hover:border-purple-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold transition-colors ${
                        selectedAnswer === option
                          ? 'bg-purple-500'
                          : 'bg-gray-800 group-hover:bg-purple-600'
                      }`}>
                        {['A', 'B', 'C', 'D'][i]}
                      </div>
                      <span className="text-white font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-3">
                {!isFirstQuestion && (
                  <button 
                    onClick={handlePrevious}
                    className="px-6 py-3 bg-gray-800 text-gray-400 rounded-lg font-semibold hover:text-white border border-gray-700 flex items-center gap-2"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>
                )}
              </div>
              
              {isLastQuestion ? (
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !selectedAnswer}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                    selectedAnswer && !loading
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:opacity-90'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                  <CheckCircle size={20} />
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  disabled={!selectedAnswer}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                    selectedAnswer
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next Question
                  <ChevronRight size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Quiz Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Answered</span>
                    <span className="text-2xl font-bold text-green-400">{answeredQuestions}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Remaining</span>
                    <span className="text-white font-bold">
                      {remainingQuestions}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Time Left</span>
                    <span className={`font-bold ${timeRemaining < 300 ? 'text-red-400' : 'text-purple-400'}`}>
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Question Navigation</h3>
              <div className="grid grid-cols-5 gap-2">
                {currentQuiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (index > currentQuestionIndex) {
                        alert("Please answer the current question before proceeding to the next one.");
                        return;
                      }
                      
                      if (index < currentQuestionIndex) {
                        for (let i = currentQuestionIndex; i > index; i--) {
                          previousQuestion();
                        }
                      }
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                      index === currentQuestionIndex
                        ? 'bg-purple-600 text-white'
                        : getCurrentAnswer(currentQuiz.questions[index]._id)
                        ? 'bg-green-600 text-white'
                        : index < currentQuestionIndex
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuizPage;