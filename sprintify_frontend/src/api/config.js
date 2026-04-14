import axios from "axios";
import useAuthStore from "../store/authstore";

// Always use the backend API - JSON server support removed
export const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

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
  // Try to get token from Zustand store first
  let token = useAuthStore.getState().token;
  
  // If no token in store, try localStorage directly (handles persist hydration timing)
  if (!token) {
    try {
      const persistedState = localStorage.getItem("spritify-auth-token");
      if (persistedState) {
        const parsed = JSON.parse(persistedState);
        // Zustand persist format: { state: { token, user, ... }, version: ... }
        token = parsed.state?.token;
      }
    } catch (error) {
      console.error("Failed to read token from localStorage:", error);
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    // Log once per session for debugging
    if (!protectedApi.lastTokenLogged || protectedApi.lastTokenLogged !== token.substring(0, 20)) {
      console.log("✅ Auth token set:", token.substring(0, 20) + "...");
      protectedApi.lastTokenLogged = token.substring(0, 20);
    }
  } else {
    console.warn("❌ WARNING: No token found - request may fail with 401");
    console.warn("   Store token:", useAuthStore.getState().token ? "exists" : "missing");
    console.warn("   localStorage:", localStorage.getItem("spritify-auth-token") ? "exists" : "missing");
  }
  return config;
});

// Response interceptor for handling auth errors and retries
let isRetrying = false;

protectedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - retry once with fresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Prevent infinite retry loops
      if (isRetrying) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      isRetrying = true;

      try {
        // Wait briefly for token to be available
        await new Promise(resolve => setTimeout(resolve, 100));

        // Try to get fresh token from store
        const freshToken = useAuthStore.getState().token;

        if (freshToken) {
          // Try also checking localStorage as backup
          const storedToken = localStorage.getItem("spritify-auth-token");
          const tokenToUse = freshToken || (storedToken ? JSON.parse(storedToken).state?.token : null);

          if (tokenToUse) {
            originalRequest.headers.Authorization = `Bearer ${tokenToUse}`;
            isRetrying = false;
            return protectedApi(originalRequest);
          }
        }
      } catch (retryError) {
        console.error("Error during token retry:", retryError);
      }

      isRetrying = false;
      // Token not available, clear auth and redirect
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // For other errors or already retried requests
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { protectedApi };
export default api;
