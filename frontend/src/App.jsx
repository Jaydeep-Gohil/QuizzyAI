import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { QuizProvider, useQuiz } from "./context/QuizContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import QuizzesPage from "./pages/QuizzesPage";
import QuizDetailPage from "./pages/QuizDetailPage";
import TakeQuizPage from "./pages/TakeQuizPage";
import EventsPage from "./pages/EventsPage";
import StudentsPage from "./pages/StudentsPage";
import SettingsPage from "./pages/SettingsPage";
import "./App.css";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

// Main Layout Component for authenticated pages
const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        {children}
      </div>
    </div>
  );
};

const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><SignInPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignUpPage /></PublicRoute>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/quizzes" element={
          <ProtectedRoute>
            <MainLayout>
              <QuizzesPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/quiz-detail" element={
          <ProtectedRoute>
            <MainLayout>
              <QuizDetailPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/take-quiz" element={
          <ProtectedRoute>
            <MainLayout>
              <TakeQuizPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <MainLayout>
              <EventsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/students" element={
          <ProtectedRoute>
            <MainLayout>
              <StudentsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AppProvider>
      <QuizProvider>
        <AppContent />
      </QuizProvider>
    </AppProvider>
  );
};

export default App;
