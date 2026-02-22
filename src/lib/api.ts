import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("userInfo");
  if (stored) {
    const userInfo = JSON.parse(stored);
    if (userInfo?.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
  }
  return config;
});

export default api;
