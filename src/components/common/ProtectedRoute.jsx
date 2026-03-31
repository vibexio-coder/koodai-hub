import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// ─── ProtectedRoute ───────────────────────────────────────────────────────────
// Props:
//   role?         — single role string (backward compat): 'admin' | 'vendor' | 'delivery'
//   allowedRoles? — array of allowed roles: ['admin', 'vendor']
//
// Usage — single role (old style):
//   <Route element={<ProtectedRoute role="admin" />}>
//
// Usage — multiple roles:
//   <Route element={<ProtectedRoute allowedRoles={['admin', 'vendor']} />}>

const ProtectedRoute = ({ role, allowedRoles }) => {
  const { user, userRole, userStatus, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <svg className="animate-spin h-8 w-8 text-yellow-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      </div>
    );
  }

  // Not authenticated
  if (!user) return <Navigate to="/login" replace />;

  // Suspended account
  if (userStatus === "suspended") return <Navigate to="/suspended" replace />;

  // Role check — build effective allowed list from either prop
  const effective = allowedRoles ?? (role ? [role] : null);
  if (effective && !effective.includes(userRole)) {
    return <Navigate to="/redirect" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
