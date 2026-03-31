// ─── Centralized Axios Client ────────────────────────────────────────────────
// All API requests go through this client.
// - Reads base URL from VITE_API_BASE_URL env var
// - Auto-attaches Firebase ID token on every request
// - Handles token refresh transparently
// - Parses error messages from backend response shape { success, message }

import axios from 'axios';
import { auth } from '../firebase/firebase.config.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15s timeout
});

// ─── Request Interceptor — attach tokens ────────────────────────────────────────
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // 1. Check for custom vendor JWT token
      const vendorToken = localStorage.getItem('koodai_token') || sessionStorage.getItem('koodai_token');
      if (vendorToken) {
        config.headers.Authorization = `Bearer ${vendorToken}`;
        return config; // Early return if custom token is used
      }

      // 2. Fallback to Firebase admin token
      const user = auth?.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('[apiClient] Interceptor - Token error:', err.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — normalize errors ─────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Auto-retry once on 401 with a fresh token (handles token expiry)
    if (
      error.response?.status === 401 &&
      !originalRequest._retried &&
      auth.currentUser
    ) {
      originalRequest._retried = true;
      try {
        const freshToken = await auth.currentUser.getIdToken(true); // force refresh
        originalRequest.headers.Authorization = `Bearer ${freshToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('[apiClient] Token refresh failed:', refreshError.message);
      }
    }

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
