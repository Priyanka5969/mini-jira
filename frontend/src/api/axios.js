import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 60000, // 60 seconds timeout (Render takes ~50s to wake up)
});

// Retry configuration
const MAX_RETRIES = 2; // Reduced retries since we have 60s timeout
const RETRY_DELAY = 5000; // 5 seconds between retries

// Helper function to check if error is retryable
const isRetryableError = (error) => {
  // Network errors or 5xx server errors
  return (
    !error.response || // Network error
    (error.response && error.response.status >= 500) || // Server error
    error.code === 'ECONNABORTED' || // Timeout
    error.code === 'ERR_NETWORK' // Network error
  );
};

// Add token to requests from localStorage (fallback for blocked cookies)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 errors - clear invalid token
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Retry on network/server errors
    const config = error.config;
    if (isRetryableError(error) && config && !config.__retryCount) {
      config.__retryCount = config.__retryCount || 0;
      
      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        
        // Retry the request
        return api.request(config);
      }
    }

    // Format error message for user
    if (!error.response) {
      error.message = 'Cannot connect to server. The backend may be starting up (takes up to 60 seconds).';
    }

    return Promise.reject(error);
  }
);

export default api;
