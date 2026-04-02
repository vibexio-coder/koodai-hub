// ─── Centralized Axios Client ────────────────────────────────────────────────
// All API requests go through this client.
// - Reads base URL from VITE_API_BASE_URL env var
// - Auto-attaches JWT token from localStorage on every request
// - Parses error messages from backend response shape { success, message }

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout
});

// ─── Request Interceptor — attach JWT token ─────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('koodai_token') || sessionStorage.getItem('koodai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — normalize errors ─────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract backend error message if available
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.join(', ') ||
      error.message ||
      'An unexpected error occurred';

    // Attach clean message to error object for easy consumption in components
    error.displayMessage = message;
    return Promise.reject(error);
  }
);

export default apiClient;
