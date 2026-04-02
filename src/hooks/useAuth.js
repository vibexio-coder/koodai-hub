import { useEffect, useState, useCallback, useRef } from "react";
import apiClient from "../services/apiClient.js";

// ─── useAuth ──────────────────────────────────────────────────────────────────
// Pure JWT-based session hook. No Firebase.
//
// Flow:
//   1. On mount → read token from localStorage / sessionStorage
//   2. No token  → user = null, loading = false
//   3. Token found → call GET /api/auth/me
//   4. Success → populate user, userRole, userStatus
//   5. Failure (401 / expired) → clear token, logout
//
// Return shape is backward-compatible with the old Firebase-based hook.
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = "koodai_token";

/** Read token from localStorage first, then sessionStorage */
const getStoredToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;

/** Remove token from both storages */
const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("adminSession");
  sessionStorage.removeItem("adminSession");
  localStorage.removeItem("vendorSession");
  sessionStorage.removeItem("vendorSession");
};

const useAuth = () => {
  const [user,       setUser]       = useState(null);
  const [dbUser,     setDbUser]     = useState(null);  // full MongoDB record
  const [userRole,   setUserRole]   = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const isMounted = useRef(true);

  /** Fetch the current user profile from the backend */
  const fetchUser = useCallback(async () => {
    const token = getStoredToken();

    // 1. No token → immediately clear state
    if (!token) {
      if (isMounted.current) {
        setUser(null);
        setDbUser(null);
        setUserRole(null);
        setUserStatus(null);
        setLoading(false);
      }
      return;
    }

    // 2. Token exists → verify with backend
    try {
      const res = await apiClient.get("/auth/me");
      const profile = res.data?.user;

      if (!isMounted.current) return;

      if (profile) {
        setUser(profile);
        setDbUser(profile);
        setUserRole(profile.role   ?? null);
        setUserStatus(profile.status ?? null);
        setError(null);
      } else {
        throw new Error("Empty profile response");
      }
    } catch (err) {
      if (!isMounted.current) return;
      const status = err.response?.status;
      console.warn("[useAuth] Session check failed:", err.displayMessage || err.message);

      // 401 / 403 = token invalid or expired → logout
      if (status === 401 || status === 403) {
        clearStoredToken();
        setUser(null);
        setDbUser(null);
        setUserRole(null);
        setUserStatus(null);
        setError("Session expired. Please log in again.");
      } else {
        // Network error or 5xx — don't wipe session, just flag the error
        setError("Could not reach server. Please check your connection.");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  // Run on mount; cleanup sets isMounted = false to prevent stale state updates
  useEffect(() => {
    isMounted.current = true;
    fetchUser();
    return () => { isMounted.current = false; };
  }, [fetchUser]);

  /** Manually refresh user profile (call after role update, profile edit, etc.) */
  const refreshUser = useCallback(async () => {
    if (isMounted.current) setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  /** Log out: clear token + reset state */
  const logout = useCallback(() => {
    clearStoredToken();
    if (!isMounted.current) return;
    setUser(null);
    setDbUser(null);
    setUserRole(null);
    setUserStatus(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    // ── Core (backward-compatible) ────────────────────────────────────────────
    user,         // MongoDB user object (id, name, email, role, status, avatar)
    userRole,     // 'admin' | 'vendor' | 'delivery' | 'customer'
    userStatus,   // 'active' | 'inactive' | 'suspended'
    loading,      // true while checking session on app load

    // ── Extras ────────────────────────────────────────────────────────────────
    dbUser,       // alias for user (full MongoDB record)
    error,        // session or network error message
    refreshUser,  // () => Promise<void> — force re-fetch from backend
    logout,       // () => void — clear session + reset state
  };
};

export default useAuth;
