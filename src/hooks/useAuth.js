import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import apiClient from "../services/apiClient.js";

// ─── useAuth ──────────────────────────────────────────────────────────────────
// Keeps Firebase Auth as the session source of truth.
// On sign-in, fetches role + status from the backend /api/me endpoint
// (which reads our MongoDB User record instead of Firestore).
//
// Return shape is IDENTICAL to the old hook so no consumers break.

const useAuth = () => {
  const [user,       setUser]       = useState(null);
  const [dbUser,     setDbUser]     = useState(null); // MongoDB user record
  const [userRole,   setUserRole]   = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // Fetch the backend user profile (called after Firebase confirms auth state)
  const fetchDbUser = useCallback(async (currentUser) => {
    try {
      const res = await apiClient.get("/me");
      const profile = res.data?.user || res.data; // Handle different response shapes
      
      if (profile) {
        setDbUser(profile);
        setUserRole(profile.role ?? null);
        setUserStatus(profile.status ?? null);
        return;
      }
    } catch (err) {
      console.warn("[useAuth] Could not fetch backend user profile:", err.displayMessage || err.message);
      // Fallback: Use Firebase user info if backend fails, do NOT logout
      setDbUser(null);
      // Optional: you could infer a default role here if needed, 
      // but keeping it null to signify "unverified by backend"
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Start/Keep loading as soon as an auth change is detected
      setLoading(true);

      if (!currentUser) {
        if (isMounted) {
          setUser(null);
          setDbUser(null);
          setUserRole(null);
          setUserStatus(null);
          setError(null);
          setLoading(false);
        }
        return;
      }

      // We have a Firebase user, now get the backend profile before finishing loading
      try {
        const token = await currentUser.getIdToken();
        const res = await apiClient.get("/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profile = res.data?.user || res.data;
        
        if (isMounted) {
          if (profile) {
            setDbUser(profile);
            setUserRole(profile.role ?? null);
            setUserStatus(profile.status ?? null);
          }
          setUser(currentUser);
        }
      } catch (err) {
        console.warn("[useAuth] Backend profile fetch failed:", err.message);
        if (isMounted) {
          setUser(currentUser); // Keep Firebase user even if backend fails
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []); // Removed fetchDbUser from deps to keep it simple and avoid effect re-runs

  // Manual refresh — call this after role promotion or profile update
  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await fetchDbUser();
    }
  }, [fetchDbUser]);

  return {
    // ── Core (same as old hook) ───────────────────────────────────────────────
    user,         // Firebase user object (uid, email, displayName, etc.)
    userRole,     // 'admin' | 'vendor' | 'delivery' | 'customer'
    userStatus,   // 'active' | 'inactive' | 'suspended'
    loading,

    // ── Extras (new, safe to ignore if not needed) ────────────────────────────
    dbUser,       // Full MongoDB user record
    error,        // Non-fatal fetch error message
    refreshUser,  // () => Promise<void> — force re-fetch from backend
  };
};

export default useAuth;
