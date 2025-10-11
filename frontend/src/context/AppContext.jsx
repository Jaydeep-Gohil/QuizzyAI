import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout, getMyStates } from "../services/auth.service";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    bootstrap();
  }, []);

  const bootstrap = async () => {
    try {
      const data = await getMe();
      // backend success payload merges user fields at root, we ensure minimal shape
      setCurrentUser(data);
      setIsAuthenticated(true);
    } catch (_err) {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  };

  const getMyStatesMethod = async () => {
    return await getMyStates();
  };

  const signOut = async () => {
    try {
      await logout();
    } catch (_e) {}
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    sidebarOpen,
    setSidebarOpen,
    selectedQuiz,
    setSelectedQuiz,
    currentQuestion,
    setCurrentQuestion,
    quizStarted,
    setQuizStarted,
    signOut,
    getMyStatesMethod,
    bootstrap,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
