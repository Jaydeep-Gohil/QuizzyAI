import API from "./api.config";

export const getMannualQuizzes = async (page, limit) => {
  const res = await API.get(`/quizzes?page=${page}&limit=${limit}`);
  return res.data;
};

// Quiz Attempt Services
export const startQuizAttempt = async (quizId) => {
  const res = await API.post("/quiz-attempts/start", { quizId });
  return res.data;
};

export const submitQuizAttempt = async (attemptId, answers) => {
  console.log('Submitting quiz attempt:', { attemptId, answers });
  const res = await API.post(`/quiz-attempts/${attemptId}/submit`, { answers });
  return res.data;
};

export const getQuizAttempts = async (quizId, page = 1, limit = 10) => {
  const res = await API.get(`/quiz-attempts/quiz/${quizId}?page=${page}&limit=${limit}`);
  return res.data;
};

export const getAttemptDetails = async (attemptId) => {
  const res = await API.get(`/quiz-attempts/${attemptId}`);
  return res.data;
};

export const getMyAttempts = async (page = 1, limit = 10, status) => {
  const params = new URLSearchParams({ page, limit });
  if (status) params.append('status', status);
  const res = await API.get(`/quiz-attempts/my-attempts?${params}`);
  return res.data;
};
