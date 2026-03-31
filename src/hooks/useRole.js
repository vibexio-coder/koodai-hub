import { useMemo } from "react";
import useAuth from "./useAuth.js";

// ─── useRole ──────────────────────────────────────────────────────────────────
// Derives role-based boolean flags from useAuth.
// Keeps role-based routing decoupled from auth state fetching.
//
// Usage:
//   const { isAdmin, isVendor, isDelivery, role, loading } = useRole();

const useRole = () => {
  const { userRole, loading, user } = useAuth();

  const flags = useMemo(() => ({
    role:       userRole,
    isAdmin:    userRole === "admin",
    isVendor:   userRole === "vendor",
    isDelivery: userRole === "delivery",
    isCustomer: userRole === "customer",
    isLoggedIn: !!user,
    // Route guard helpers
    canAccessAdmin:    userRole === "admin",
    canAccessVendor:   userRole === "admin" || userRole === "vendor",
    canAccessDelivery: userRole === "admin" || userRole === "delivery",
  }), [userRole, user]);

  return { ...flags, loading };
};

export default useRole;
