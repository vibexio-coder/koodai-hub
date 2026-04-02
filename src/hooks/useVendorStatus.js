import { useState, useEffect, useCallback, useRef } from "react";
import apiClient from "../services/apiClient.js";

// ─── useVendorStatus ──────────────────────────────────────────────────────────
// Fetches the current user's vendor profile and status from the backend.
// Pure JWT-based — zero Firebase.
//
// Flow:
//   1. On mount → check localStorage for koodai_token
//   2. No token  → return null state immediately
//   3. Token found → call GET /api/auth/me to get vendorProfile ref
//   4. If vendorProfile exists → call GET /api/vendors/:id
//   5. Store vendor data + status in state
//   6. 401/403 → clear token + reset state
//
// Usage:
//   const { vendorStatus, vendorId, isPending, isApproved, loading } = useVendorStatus();
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN_KEY = "koodai_token";

const getStoredToken = () =>
  localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || null;

const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("vendorSession");
  sessionStorage.removeItem("vendorSession");
};

const useVendorStatus = () => {
  const [vendorId,     setVendorId]     = useState(null);
  const [vendorData,   setVendorData]   = useState(null);
  const [vendorStatus, setVendorStatus] = useState(null); // 'pending' | 'approved' | 'rejected' | 'suspended'
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const isMounted = useRef(true);

  const resetState = useCallback((err = null) => {
    if (!isMounted.current) return;
    setVendorId(null);
    setVendorData(null);
    setVendorStatus(null);
    setError(err);
    setLoading(false);
  }, []);

  const fetchVendorStatus = useCallback(async () => {
    const token = getStoredToken();

    // 1. No token → clear and stop
    if (!token) {
      resetState();
      return;
    }

    try {
      if (isMounted.current) { setLoading(true); setError(null); }

      // 2. Get user profile to find vendorProfile reference
      const meRes = await apiClient.get("/auth/me");
      if (!isMounted.current) return;
      const profile = meRes.data?.user;

      if (!profile?.vendorProfile) {
        resetState();
        return;
      }

      // 3. Fetch the full vendor document using the vendorProfile ref
      const vendorRes = await apiClient.get(`/vendors/${profile.vendorProfile}`);
      if (!isMounted.current) return;
      const vendor = vendorRes.data?.data;

      if (vendor) {
        setVendorId(vendor._id);
        setVendorData(vendor);
        setVendorStatus(vendor.status);
      } else {
        resetState("Vendor profile not found.");
      }
    } catch (err) {
      if (!isMounted.current) return;
      const status = err.response?.status;
      console.warn("[useVendorStatus] Error fetching vendor status:", err.displayMessage || err.message);

      if (status === 401 || status === 403) {
        clearStoredToken();
        resetState("Session expired. Please log in again.");
      } else {
        resetState(err.displayMessage || "Could not load vendor status.");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [resetState]);

  // Run on mount; cleanup prevents stale state updates after unmount
  useEffect(() => {
    isMounted.current = true;
    fetchVendorStatus();
    return () => { isMounted.current = false; };
  }, [fetchVendorStatus]);

  return {
    vendorId,
    vendorData,
    vendorStatus,
    loading,
    error,
    refresh: fetchVendorStatus, // () => Promise<void>

    // Convenience booleans
    isPending:   vendorStatus === "pending",
    isApproved:  vendorStatus === "approved",
    isRejected:  vendorStatus === "rejected",
    isSuspended: vendorStatus === "suspended",
    hasVendor:   !!vendorId,
  };
};

export default useVendorStatus;
