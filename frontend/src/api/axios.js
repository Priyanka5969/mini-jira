import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  timeout: 60000, // 60 seconds timeout (Render takes ~50s to wake up)
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to check if error is retryable
const isRetryableError = (error) => {
  // Network errors or 5xx server errors
  return (
    !error.response || // Network error
    error.response.status >= 500 || // Server error
    error.code === 'ECONNABORTED' || // Timeout
    error.code === 'ERR_NETWORK' // Network error
  );
};

// Retry logic with exponential backoff
const retryRequest = async (config, retryCount = 0) => {
  if (retryCount >= MAX_RETRIES) {
    throw new Error('Backend is taking too long to respond. Please try again in a moment.');
  }

  const delay = RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return api.request(config);
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
    if (isRetryableError(error) && error.config && !error.config.__retryCount) {
      error.config.__retryCount = (error.config.__retryCount || 0) + 1;
      return retryRequest(error.config, error.config.__retryCount - 1);
    }

    return Promise.reject(error);
  }
);

export default api;
