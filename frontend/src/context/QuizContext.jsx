import { createContext, useContext, useState, useEffect } from "react";
import { getMannualQuizzes, startQuizAttempt, submitQuizAttempt, getAttemptDetails } from "../services/quiz.service";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  
  // Quiz Attempt State
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // ✅ Fetch quizzes when component mounts or pagination changes
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getMannualQuizzes(pageCount, pageLimit);
      setQuizzes(data?.quizzes || []);
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [pageCount, pageLimit]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (quizStarted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0 && quizStarted) {
      // Auto-submit when time runs out
      // call handleSubmitQuiz without override, it will use current answers
      handleSubmitQuiz().catch(err => {
        console.error("Auto-submit failed:", err);
      });
    }
    return () => clearInterval(interval);
  }, [quizStarted, timeRemaining]);

  const startQuiz = async (quiz) => {
    try {
      setLoading(true);
      // startQuizAttempt returns parsed data (attempt object)
      const data = await startQuizAttempt(quiz._id);
      console.log('Started quiz attempt:', data);
      setCurrentAttempt(data);
      setCurrentQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers([]);
      setTimeRemaining((quiz.settings?.timeLimit || 60) * 60); // Convert minutes to seconds, default 60 minutes
      setQuizStarted(true);
      setQuizCompleted(false);
      setQuizResult(null);
      return data;
    } catch (error) {
      console.error("Failed to start quiz:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = (questionId, selectedAnswer, timeTaken = 0) => {
    const newAnswer = {
      questionId,
      selectedAnswer,
      timeTaken
    };

    setAnswers(prev => {
      const existingIndex = prev.findIndex(a => a.questionId === questionId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnswer;
        return updated;
      }
      return [...prev, newAnswer];
    });
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Accept optional overrideAnswers so UI can pass the final merged answers
  const handleSubmitQuiz = async (overrideAnswers = null) => {
    try {
      setLoading(true);
      
      if (!currentAttempt || !currentAttempt._id) {
        throw new Error("No active quiz attempt found. Please start the quiz again.");
      }

      const payloadAnswers = overrideAnswers || answers;
      
      const result = await submitQuizAttempt(currentAttempt._id, payloadAnswers);
      // submitQuizAttempt returns parsed result object
      setQuizResult(result);
      setQuizCompleted(true);
      setQuizStarted(false);
      return result;
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setCurrentAttempt(null);
    setCurrentQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeRemaining(0);
    setQuizStarted(false);
    setQuizCompleted(false);
    setQuizResult(null);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getCurrentAnswer = (questionId) => {
    return answers.find(a => a.questionId === questionId);
  };

  const value = {
    // Quiz list
    quizzes,
    loading,
    pageCount,
    pageLimit,
    setPageCount,
    setPageLimit,
    fetchQuizzes, // Add refresh function
    
    // Quiz attempt
    currentAttempt,
    currentQuiz,
    currentQuestionIndex,
    answers,
    timeRemaining,
    quizStarted,
    quizCompleted,
    quizResult,
    
    // Quiz actions
    startQuiz,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    handleSubmitQuiz,
    resetQuiz,
    formatTime,
    getCurrentAnswer,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
