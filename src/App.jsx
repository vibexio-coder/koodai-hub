import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import RoleRedirect from "./pages/auth/RoleRedirect";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";

// Vendor pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorRequestForm from "./pages/vendor/RequestForm";

// Route guard
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/redirect" element={<RoleRedirect />} />

        {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="/vendor-request" element={<VendorRequestForm />} />
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />

        {/* Vendor Routes */}
        <Route element={<ProtectedRoute role="vendor" />}>

        </Route>

        {/* Default Route */}

        <Route path="*" element={<h1>404 | Page Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;
