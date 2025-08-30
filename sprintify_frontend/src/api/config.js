import axios from "axios";
import useAuthStore from "../store/authstore";

// Use environment variable or default to json-server for development
const USE_JSON_SERVER = import.meta.env.VITE_USE_JSON_SERVER !== 'false';
export const baseUrl =  "http://localhost:4000/api/v1";

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
  // Skip auth headers for json-server
  if (baseUrl.includes('3001')) {
    return config;
  }
  
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Only log token on first use or when it changes (reduce spam)
    if (!protectedApi.lastTokenLogged || protectedApi.lastTokenLogged !== token.substring(0, 20)) {
      console.log("🔑 Auth token configured for API requests");
      protectedApi.lastTokenLogged = token.substring(0, 20);
    }
  } else {
    console.log("❌ No token found in auth store");
  }
  return config;
});

// Response interceptor for handling auth errors
protectedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip auth error handling for json-server
    if (baseUrl.includes('3001')) {
      return Promise.reject(error);
    }
    
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
