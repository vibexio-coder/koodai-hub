import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db, auth } from '../../firebase/firebase.config';
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tag } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("vendor");
  const [applicationId, setApplicationId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleVendorLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Validate application ID
      if (!applicationId.trim()) {
        toast.error('Please enter Application ID');
        setLoading(false);
        return;
      }
      
      // Check if vendor exists in hotels collection with this application ID
      const hotelsRef = collection(db, 'hotels');
      const q = query(hotelsRef, where('applicationId', '==', applicationId.trim()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error('Invalid Application ID');
        setLoading(false);
        return;
      }
      
      // Get vendor data
      const vendorDoc = querySnapshot.docs[0];
      const vendorData = vendorDoc.data();
      
      // Check if vendor is approved
      if (vendorData.status !== 'approved') {
        toast.error('Your application is pending approval');
        setLoading(false);
        return;
      }
      
      // Store vendor info in localStorage/sessionStorage for session management
      const sessionData = {
        vendorId: vendorDoc.id,
        applicationId: applicationId.trim(),
        hotelName: vendorData.hotelName || '',
        email: vendorData.email || '',
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
      };
      
      if (rememberMe) {
        localStorage.setItem('vendorSession', JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem('vendorSession', JSON.stringify(sessionData));
      }
      
      toast.success('Login successful!');
      
      // Navigate to vendor dashboard
      navigate('/vendor-dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'permission-denied') {
        setError('Database permission error');
        toast.error('Unable to access vendor data');
      } else {
        setError('Login failed. Please try again.');
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (adminEmail === "vibexio@gmail.com" && adminPassword === "123456") {
        console.log("Admin login successful!");
        navigate("/admin-dashboard");
      } else {
        setError("Invalid admin credentials. Please try again.");
        setLoading(false);
      }
    }, 1000);
  };

  const handleSubmit = async (e) => {
    if (userType === "vendor") {
      await handleVendorLogin(e);
    } else {
      handleAdminLogin(e);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">KOODAI HUB</h1>
          <p className="text-gray-500 text-sm mt-1">Secure Login Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          
          {/* Role Selector */}
          <div className="grid grid-cols-2 border-b border-gray-100">
            <button
              onClick={() => {
                setUserType("vendor");
                setError("");
              }}
              className={`py-4 text-sm font-medium transition-all duration-200 relative ${
                userType === "vendor"
                  ? "text-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Vendor Login
              {userType === "vendor" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
              )}
            </button>
            <button
              onClick={() => {
                setUserType("admin");
                setError("");
              }}
              className={`py-4 text-sm font-medium transition-all duration-200 relative ${
                userType === "admin"
                  ? "text-yellow-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Admin Login
              {userType === "admin" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500"></div>
              )}
            </button>
          </div>

          {/* Form Container */}
          <div className="p-8">

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* VENDOR LOGIN FIELDS */}
              {userType === "vendor" && (
                <>
                  {/* Application ID */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                      Application ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Tag className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value)}
                        placeholder="VEND795795863"
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Enter your unique application ID provided during registration
                    </p>
                  </div>
                
                  {/* Vendor Options */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link to="/forgot-id" className="text-sm text-yellow-600 hover:text-yellow-700 transition-colors">
                      Forgot Application ID?
                    </Link>
                  </div>
                </>
              )}

              {/* ADMIN LOGIN FIELDS */}
              {userType === "admin" && (
                <>
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                      Admin Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        required
                        value={adminEmail}
                        onChange={(e) => {
                          setAdminEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter admin email"
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                      Admin Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <input
                        type={showAdminPassword ? "text" : "password"}
                        required
                        value={adminPassword}
                        onChange={(e) => {
                          setAdminPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter admin password"
                        className="w-full pl-10 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showAdminPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  loading
                    ? "bg-yellow-400 cursor-not-allowed text-white"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    {userType === "vendor" ? "Accessing Vendor Panel..." : "Authenticating Admin..."}
                  </span>
                ) : (
                  `Sign in to ${userType === "vendor" ? "Vendor" : "Admin"} Portal`
                )}
              </button>
            </form>

            {/* Additional Links */}
            {userType === "vendor" && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-center text-gray-600">
                  Don't have a vendor account?{" "}
                  <Link to="/vendor-request" className="font-medium text-yellow-600 hover:text-yellow-700 transition-colors">
                    Request access
                  </Link>
                </p>
              </div>
            )}

            {/* Admin Note */}
            {userType === "admin" && !error && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-center text-gray-500">
                  Use authorized credentials to access admin panel
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;