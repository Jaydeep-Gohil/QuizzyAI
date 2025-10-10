import React from 'react';
import { BookOpen, Award, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { categories } from '../data/mockData';

const LandingPage = () => {
  const { setIsAuthenticated } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <nav className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg"></div>
          <span className="text-xl font-bold text-white">Quizzy</span>
        </div>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-gray-300 hover:text-white">Quiz</a>
          <a href="#" className="text-gray-300 hover:text-white">Weekly Quiz</a>
          <a href="#" className="text-gray-300 hover:text-white">Rewards</a>
          <a href="#" className="text-gray-300 hover:text-white">About</a>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/signin')} className="px-4 py-2 text-white border border-purple-500 rounded-lg hover:bg-purple-500/10">Sign In</button>
          <button onClick={() => navigate('/signup')} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90">Register</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6">
          <span className="text-purple-300 text-sm">✨ The ultimate quiz experience</span>
        </div>
        <h1 className="text-6xl font-bold text-white mb-6">
          Learn, Quiz, <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Earn Rewards</span>
        </h1>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of students and teachers on the ultimate quiz platform. Test your knowledge, compete with peers, and win exciting rewards
        </p>
        <div className="flex gap-4 justify-center mb-12">
          <button onClick={() => { setIsAuthenticated(true); navigate('/dashboard'); }} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:opacity-90">Get Started</button>
          <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100">Explore Quizzes</button>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-gray-900"></div>
            ))}
          </div>
          <span className="text-gray-300">10,000+ students joined this week</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4">
            <BookOpen size={16} className="text-purple-300" />
            <span className="text-purple-300 text-sm">Categories</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Explore <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Quiz Categories</span></h2>
          <p className="text-gray-400">Discover quizzes across various subjects to test and expand your knowledge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors cursor-pointer">
              <div className={`w-12 h-12 bg-gradient-to-br ${cat.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                {cat.icon}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{cat.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Test your knowledge in {cat.name.toLowerCase()} with our challenging quizzes</p>
              <button className="text-purple-400 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
                Explore Quizzes <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4">
            <Award size={16} className="text-purple-300" />
            <span className="text-purple-300 text-sm">Features</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Why <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Quizzy</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: '📚', title: 'Personalized Learning', desc: 'Adaptive quizzes that adjust to your knowledge level and learning pace' },
            { icon: '🎁', title: 'Reward System', desc: 'Earn points, badges, and real rewards for your achievements' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Adaptive quizzes that adjust to your knowledge level and learning pace' },
            { icon: '🏆', title: 'Competitive Leaderboards', desc: 'Compete with peers and climb the ranks in various categories' }
          ].map((feature, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-white font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Your Quiz Journey?</h2>
          <p className="text-purple-100 mb-8">Join thousands of students and teachers. Sign up today and get access to all features</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/signup')} className="px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100">Create Account</button>
            <button className="px-8 py-4 bg-purple-500/20 text-white rounded-lg font-semibold hover:bg-purple-500/30 border border-white/20">Explore Quizzes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
