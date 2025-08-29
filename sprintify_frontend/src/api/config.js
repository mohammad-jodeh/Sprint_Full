import axios from "axios";
import useAuthStore from "../store/authstore";

export const baseUrl = "http://localhost:4000/api/v1";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

const protectedApi = axios.create({
  baseURL: baseUrl,
  timeout: 10000, // 10 second timeout
});

// Request interceptor for adding auth token
protectedApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("🔑 Sending token:", token.substring(0, 50) + "...");
  } else {
    console.log("❌ No token found in auth store");
  }
  return config;
});

// Response interceptor for handling auth errors
protectedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { protectedApi };
export default api;
