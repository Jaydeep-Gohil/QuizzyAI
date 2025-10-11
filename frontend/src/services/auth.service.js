import API from "./api.config";

export const register = async ({ name, email, password, role }) => {
  const res = await API.post("/users/register", {
    name,
    email,
    password,
    role,
  });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await API.post("/users/login", { email, password });
  return res.data;
};

export const logout = async () => {
  const res = await API.post("/users/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await API.get("/users/me");
  return res.data;
};

export const getMyStates = async () => {
  const res = await API.get("/quiz-attempts/statistics");
  console.log(res);
  return res.data;
};
