import { useState, useEffect, useCallback } from "react";
import { auth } from "../firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import apiClient from "../services/apiClient.js";

// ─── useVendorStatus ──────────────────────────────────────────────────────────
// Fetches the current user's vendor profile status from the backend.
// Uses the Firebase token automatically via apiClient.
//
// Usage:
//   const { vendorStatus, vendorId, isPending, isApproved, loading } = useVendorStatus();

const useVendorStatus = () => {
  const [vendorId,     setVendorId]     = useState(null);
  const [vendorData,   setVendorData]   = useState(null);
  const [vendorStatus, setVendorStatus] = useState(null); // 'pending' | 'approved' | 'rejected' | 'suspended'
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchVendorStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current user's DB profile first to get vendorProfile ref
      const meRes = await apiClient.get("/me");
      const profile = meRes.data?.user;

      if (!profile?.vendorProfile) {
        // User has no vendor profile yet
        setVendorId(null);
        setVendorData(null);
        setVendorStatus(null);
        return;
      }

      // Fetch the vendor document
      const vendorRes = await apiClient.get(`/vendors/${profile.vendorProfile}`);
      const vendor = vendorRes.data?.data;

      if (vendor) {
        setVendorId(vendor._id);
        setVendorData(vendor);
        setVendorStatus(vendor.status);
      }
    } catch (err) {
      console.warn("[useVendorStatus] Error fetching vendor status:", err.displayMessage || err.message);
      setError(err.displayMessage || "Could not load vendor status");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch when user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        fetchVendorStatus();
      } else {
        setVendorId(null);
        setVendorData(null);
        setVendorStatus(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchVendorStatus]);

  return {
    vendorId,
    vendorData,
    vendorStatus,
    loading,
    error,
    refresh: fetchVendorStatus,

    // Convenience booleans
    isPending:   vendorStatus === "pending",
    isApproved:  vendorStatus === "approved",
    isRejected:  vendorStatus === "rejected",
    isSuspended: vendorStatus === "suspended",
    hasVendor:   !!vendorId,
  };
};

export default useVendorStatus;
