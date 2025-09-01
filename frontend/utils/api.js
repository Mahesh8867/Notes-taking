// utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // your Django backend
});

// Add a request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
