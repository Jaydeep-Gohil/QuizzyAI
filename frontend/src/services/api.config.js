import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api`
    : "http://localhost:5000/api",
  withCredentials: true,
  timeout: 60000, // 60 second timeout
});

// Log errors but don't redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default API;
