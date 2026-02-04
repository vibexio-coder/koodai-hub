import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import VendorManagement from './VendorManagement';
import CategoryManagement from './CategoryManagement';
import OrderManagement from './OrderManagement';
import PaymentManagement from './PaymentManagement';

// Create a Layout wrapper that includes Sidebar and Header
const AdminLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Main admin dashboard with nested routes */}
      <Route path="/" element={<AdminDashboard />}>
        <Route index element={
          <AdminLayout>
            <Overview />
          </AdminLayout>
        } />
        <Route path="overview" element={
          <AdminLayout>
            <Overview />
          </AdminLayout>
        } />
        <Route path="vendors" element={
          <AdminLayout>
            <VendorManagement />
          </AdminLayout>
        } />
        <Route path="categories" element={
          <AdminLayout>
            <CategoryManagement />
          </AdminLayout>
        } />
        <Route path="orders" element={
          <AdminLayout>
            <OrderManagement />
          </AdminLayout>
        } />
        <Route path="payments" element={
          <AdminLayout>
            <PaymentManagement />
          </AdminLayout>
        } />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;