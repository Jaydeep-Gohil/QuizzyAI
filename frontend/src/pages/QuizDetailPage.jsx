import React from 'react';
import { ChevronRight, BookOpen, Clock, Users, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

const QuizDetailPage = () => {
  const { setCurrentPage, setQuizStarted, setCurrentQuestion, selectedQuiz } = useApp();

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <button onClick={() => setCurrentPage('quizzes')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
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
              onClick={() => {
                setQuizStarted(true);
                setCurrentQuestion(0);
                setCurrentPage('take-quiz');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90"
            >
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Completions</span>
              <BookOpen className="text-purple-400" size={24} />
            </div>
              <div className="text-3xl font-bold text-white">{selectedQuiz?.stats?.totalAttempts ?? 0}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Completion Time</span>
              <Clock className="text-green-400" size={24} />
            </div>
              <div className="text-3xl font-bold text-white">{selectedQuiz?.settings?.timeLimit ? `${selectedQuiz.settings.timeLimit} min` : '—'}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Average Score</span>
              <Users className="text-blue-400" size={24} />
            </div>
              <div className="text-3xl font-bold text-white">{selectedQuiz?.stats?.averageScore ? `${selectedQuiz.stats.averageScore}%` : '—'}</div>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Top Score</span>
              <Award className="text-orange-400" size={24} />
            </div>
              <div className="text-3xl font-bold text-white">{selectedQuiz?.stats?.rating ? `${selectedQuiz.stats.rating}%` : '—'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Study Material</h2>
            </div>
            <div className="space-y-4">
              {selectedQuiz?.studyMaterial?.readingTime ? (
                <div className="text-sm text-gray-400">Estimated reading time: <span className="text-white font-medium">{selectedQuiz.studyMaterial.readingTime} min</span></div>
              ) : null}
              {selectedQuiz?.studyMaterial?.content ? (
                <div className="prose prose-invert max-w-none text-gray-200 whitespace-pre-wrap">{selectedQuiz.studyMaterial.content}</div>
              ) : (
                <div className="text-gray-400">No study material provided.</div>
              )}
              {selectedQuiz?.studyMaterial?.keyPoints?.length ? (
                <div>
                  <h3 className="text-white font-semibold mb-2">Key Points</h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-1">
                    {selectedQuiz.studyMaterial.keyPoints.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {selectedQuiz?.studyMaterial?.resources?.length ? (
                <div>
                  <h3 className="text-white font-semibold mb-2">Resources</h3>
                  <ul className="space-y-1">
                    {selectedQuiz.studyMaterial.resources.map((res, idx) => (
                      <li key={idx}>
                        <a href={res.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300">
                          {res.title || res.url}
                        </a>
                        {res.type ? <span className="ml-2 text-xs text-gray-500">({res.type})</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6">Question Performance</h2>
            <div className="space-y-4">
              {[
                { q: 'What is the basic unit of life?', rate: 92 },
                { q: 'Which organelle is responsible for...?', rate: 92 },
                { q: 'What is the process of cell division...?', rate: 92 },
                { q: 'Which of the following is NOT a...?', rate: 92 },
                { q: 'What is the main function of mito...?', rate: 92 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">{i + 1}. {item.q}</span>
                    <span className="text-white font-semibold text-sm">{item.rate}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: `${item.rate}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Share This Quiz</h2>
          <p className="text-gray-400 mb-4">Share this quiz with students or colleagues</p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90 flex items-center gap-2">
            Share Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetailPage;
