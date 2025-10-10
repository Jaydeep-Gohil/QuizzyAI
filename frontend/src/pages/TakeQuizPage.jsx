import React from 'react';
import { X, Clock, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleQuestions } from '../data/mockData';

const TakeQuizPage = () => {
  const { setCurrentPage, setQuizStarted } = useApp();
  const question = sampleQuestions[0];
  
  return (
    <div className="flex-1 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => { setCurrentPage('quiz-detail'); setQuizStarted(false); }} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-bold text-white">Science & Technology Quiz</h2>
          <div></div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Question 1 of 10</span>
            <span className="text-white font-semibold">10% Complete</span>
          </div>
          <div className="bg-gray-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '10%'}}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold">{question.points} points</span>
                <div className="flex items-center gap-2 text-red-400">
                  <Clock size={20} />
                  <span className="text-xl font-bold">00:00</span>
                </div>
                <span className="px-4 py-2 bg-gray-700 text-white rounded-lg">{question.difficulty}</span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-8">{question.question}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((option, i) => (
                  <button
                    key={i}
                    className="p-6 bg-gray-900 border-2 border-gray-700 rounded-xl hover:border-purple-500 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white font-semibold group-hover:bg-purple-600 transition-colors">
                        {['A', 'B', 'C', 'D'][i]}
                      </div>
                      <span className="text-white font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button className="px-6 py-3 bg-gray-800 text-gray-400 rounded-lg font-semibold hover:text-white border border-gray-700 flex items-center gap-2">
                Skip
              </button>
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
                Next Question
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Quiz Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Score</span>
                    <span className="text-2xl font-bold text-purple-400">0</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Lives</span>
                    <div className="flex gap-1">
                      <div className="text-red-500">❤️</div>
                      <div className="text-red-500">❤️</div>
                      <div className="text-red-500">❤️</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white font-bold">1/10</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Position</span>
                    <span className="text-purple-400 font-bold">2nd</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuizPage;
