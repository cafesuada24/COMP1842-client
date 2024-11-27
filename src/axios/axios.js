import axios from "axios";
import authStore from '@/features/auth/store/auth.js';
import router from "@/router";

const instance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include token in headers
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      authStore.dispatch("logout");
      router.push("/auth/login"); // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default instance;
