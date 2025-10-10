import API from "./api.config";

export const getMannualQuizzes = async (page, limit) => {
  const res = await API.get(`/quizzes?page=${page}&limit=${limit}`);
  return res.data;
};
