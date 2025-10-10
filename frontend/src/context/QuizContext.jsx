import { createContext, useContext, useState, useEffect } from "react";
import { getMannualQuizzes } from "../services/quiz.service";

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch quizzes when component mounts or pagination changes
  useEffect(() => {
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

    fetchQuizzes();
  }, [pageCount, pageLimit]);

  const value = {
    quizzes,
    loading,
    pageCount,
    pageLimit,
    setPageCount,
    setPageLimit,
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
