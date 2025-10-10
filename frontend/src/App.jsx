import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Dashboard from './pages/Dashboard';
import QuizzesPage from './pages/QuizzesPage';
import QuizDetailPage from './pages/QuizDetailPage';
import TakeQuizPage from './pages/TakeQuizPage';
import EventsPage from './pages/EventsPage';
import StudentsPage from './pages/StudentsPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';

const AppContent = () => {
  const { currentPage, isAuthenticated } = useApp();

  // Render authentication pages
  if (!isAuthenticated) {
    if (currentPage === 'landing') return <LandingPage />;
    if (currentPage === 'signin') return <SignInPage />;
    if (currentPage === 'signup') return <SignUpPage />;
  }

  // Render main app with sidebar and header
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'quizzes' && <QuizzesPage />}
        {currentPage === 'quiz-detail' && <QuizDetailPage />}
        {currentPage === 'take-quiz' && <TakeQuizPage />}
        {currentPage === 'events' && <EventsPage />}
        {currentPage === 'students' && <StudentsPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;