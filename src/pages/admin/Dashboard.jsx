
import React, { useState, useEffect } from 'react';

import {
  Users, ShoppingBag, DollarSign, Store, CheckCircle
} from 'lucide-react';
import { categoryService, vendorService, mapVendorToUI, deliveryService, dashboardService, orderService } from '../../services';

// Components
import Sidebar from '../../components/admin/Sidebar';
import Header from '../../components/admin/Header';
import DashboardStats from '../../components/admin/DashboardStats';
import RecentOrders from '../../components/admin/RecentOrders';
import QuickActions from '../../components/admin/QuickActions';
import VendorsSection from '../../components/admin/VendorsSection';
import PartnersSection from '../../components/admin/PartnersSection';
import OrderManagement from '../../components/admin/OrderManagement';
import CategoriesSection from '../../components/admin/CategoriesSection';
import PaymentsSection from '../../components/admin/PaymentsSection';
import PlaceholderSection from '../../components/admin/PlaceholderSection';

// Modals
import AddVendorModal from '../../components/admin/Modals/AddVendorModal';
import EditVendorModal from '../../components/admin/Modals/EditVendorModal';
import VendorDetailsModal from '../../components/admin/Modals/VendorDetailsModal';
import RejectionModal from '../../components/admin/Modals/RejectionModal';
import AddCategoryModal from '../../components/admin/Modals/AddCategoryModal';
import PartnerDetailsModal from '../../components/admin/Modals/PartnerDetailsModal';
import OrderDetailsModal from '../../components/admin/Modals/OrderDetailsModal';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [partnersLoading, setPartnersLoading] = useState(true);

  // Data States
  const [stats, setStats] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  // Modal States
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showEditVendorModal, setShowEditVendorModal] = useState(false);
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [showPartnerDetailsModal, setShowPartnerDetailsModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);

  // Selection States
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [selectedPartnerDetails, setSelectedPartnerDetails] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [editingVendor, setEditingVendor] = useState(null);
  const [rejectionVendorId, setRejectionVendorId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    businessType: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Form States
  const [newVendor, setNewVendor] = useState({
    name: '',
    description: '',
    email: '',
    phone: '',
    businessType: 'store',
    address: '',
    status: 'pending',
    categoryId: '',
    categoryName: '',
    rating: 4.5,
    deliveryTime: '30-40',
    deliveryFee: 40,
    minOrder: 150,
    image: '',
    offers: '',
    featured: false,
    open: true,
    hygienePass: true,
    commissionRate: 15,
    deliveryRadius: 5,
    avgPreparationTime: '20-40',
    orderCount: 0,
    totalEarnings: 0,
    website: '',
    isVeg: false,
    cuisine: 'South Indian',
    priceRange: '₹₹',
    medicineType: 'Pharmacy',
    groceryType: 'Supermarket',
    fruitsType: 'Fruits Store',
    meatType: 'Meat Shop',
    dressType: 'Clothing Store',
  });

  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'Store',
    status: 'active',
    image: '',
    order: 0,
  });

  // Fetch Data
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch real vendor & category data
        await fetchVendors();
        await fetchCategories();
        
        // Fetch initial recent orders & stats
        await fetchRecentOrders();
        await updateStats();
        
        // Temporary empty states while migrating remaining modules
        setPartners([]);
        setUsers([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setPartnersLoading(false);
        setLoading(false);
      }
    };

    fetchAllData();

    // Polling for recent orders & stats (10s)
    const interval = setInterval(() => {
      fetchRecentOrders();
      updateStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchVendors = async () => {
    try {
      setVendorsLoading(true);
      const data = await vendorService.getAll();
      
      // Map MongoDB to UI expected structure using the service helper
      const mappedData = (Array.isArray(data) ? data : data?.vendors || [])
        .map(v => mapVendorToUI(v));

      setAllVendors(mappedData);
    } catch (e) {
      console.error('Error fetching vendors:', e);
      setAllVendors([]);
    } finally {
      setVendorsLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      setPartnersLoading(true);
      const data = await deliveryService.getAll();
      // Normalize data for UI if needed (api returns { partners: [...] } or direct array)
      const partnersList = Array.isArray(data) ? data : (data?.partners || []);
      setPartners(partnersList);
    } catch (e) {
      console.error('[Dashboard] Error fetching partners:', e);
      setPartners([]);
    } finally {
      setPartnersLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getAll();
      // Normalize _id to id for UI compatibility
      const mappedData = (Array.isArray(data) ? data : []).map(cat => ({
        ...cat,
        id: cat._id || cat.id
      }));
      setCategories(mappedData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchUsers = async () => {
    // Temporary fallback
    setUsers([]);
  };

  const fetchRecentOrders = async () => {
    try {
      const res = await orderService.getAll({ limit: 5 });
      const ordersArray = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
      
      const mappedOrders = ordersArray.map(o => ({
        id: o._id || o.id,
        orderId: o.orderNumber || `ORD-${(o._id || o.id).slice(-8).toUpperCase()}`,
        user: o.customer?.name || 'Customer',
        vendor: o.vendor?.businessName || 'Vendor',
        formattedAmount: `₹${parseFloat(o.totalAmount || 0).toFixed(2)}`,
        status: o.status || 'pending',
        time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'
      }));
      setRecentOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      setRecentOrders([]);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowOrderDetailsModal(true);
  };

  const mapStats = (statsData) => ([
    { title: 'Total Users', value: (statsData.totalUsers || 0).toString(), icon: <Users className="w-6 h-6" />, color: 'bg-blue-500', change: '+0%' },
    { title: 'Total Vendors', value: (statsData.totalVendors || 0).toString(), icon: <Store className="w-6 h-6" />, color: 'bg-green-500', change: '+0%' },
    { title: 'Active Vendors', value: (statsData.activeVendors || 0).toString(), icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-500', change: '+0%' },
    { title: 'Total Partners', value: (statsData.totalPartners || 0).toString(), icon: <Users className="w-6 h-6" />, color: 'bg-yellow-500', change: '+0%' },
    { title: "Today's Orders", value: (statsData.todaysOrders || statsData.todayOrders || 0).toString(), icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-purple-500', change: '+0%' },
    { title: 'Total Revenue', value: `₹${(statsData.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-indigo-500', change: '+0%' },
  ]);

  const updateStats = async () => {
    try {
      const data = await dashboardService.getStats();
      const statsData = data?.stats || data || {};
      setStats(mapStats(statsData));
    } catch (error) {
      console.error('Error updating stats:', error);
      setStats(mapStats({}));
    }
  };

  const handleAddVendor = async () => {
    try {
      setLoading(true);

      const selectedCategory = categories.find(cat => cat.id === newVendor.categoryId);
      const categoryName = selectedCategory ? selectedCategory.name : newVendor.categoryName;

      // Construct vendorData (logic preserved)
      const vendorData = {
        name: newVendor.name.trim(),
        description: newVendor.description.trim(),
        categoryId: newVendor.categoryId,
        categoryName: categoryName,
        email: newVendor.email.trim(),
        phone: newVendor.phone.trim(),
        address: newVendor.address.trim(),
        rating: parseFloat(newVendor.rating) || 4.5,
        deliveryTime: newVendor.deliveryTime.trim(),
        deliveryFee: parseFloat(newVendor.deliveryFee) || 40,
        minOrder: parseFloat(newVendor.minOrder) || 150,
        avgPreparationTime: newVendor.avgPreparationTime || '20-40',
        businessType: newVendor.businessType,

        ...(categoryName === 'Food' && {
          cuisine: newVendor.cuisine,
          priceRange: newVendor.priceRange,
          isVeg: newVendor.isVeg
        }),
        ...(categoryName === 'Medicine' && {
          medicineType: newVendor.medicineType,
          isVeg: false
        }),
        ...(categoryName === 'Groceries' && {
          groceryType: newVendor.groceryType,
          isVeg: false
        }),
        ...(categoryName === 'Fruits & Vegetables' && {
          fruitsType: newVendor.fruitsType,
          isVeg: true
        }),
        ...(categoryName === 'Meat & Fish' && {
          meatType: newVendor.meatType,
          isVeg: false
        }),
        ...(categoryName === 'Dress & Gadgets' && {
          dressType: newVendor.dressType,
          priceRange: newVendor.priceRange,
          isVeg: false
        }),

        image: newVendor.image,
        offers: newVendor.offers,
        status: newVendor.status,
        featured: newVendor.featured,
        open: newVendor.open,
        hygienePass: newVendor.hygienePass,
        commissionRate: newVendor.commissionRate || 15,
        deliveryRadius: newVendor.deliveryRadius || 5,
        orderCount: 0,
        totalEarnings: 0,
        website: newVendor.website || '',
      };

      // Temporary no-op
      console.log('dashboardDataService.addVendor placeholder');

      alert('Vendor added successfully!');
      setShowAddVendorModal(false);
      resetVendorForm();
      fetchVendors();
    } catch (error) {
      console.error('Error adding vendor:', error);
      alert('Failed to add vendor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVendor = async () => {
    try {
      setLoading(true);

      const selectedCategory = categories.find(cat => cat.id === editingVendor.categoryId);
      const categoryName = selectedCategory ? selectedCategory.name : editingVendor.categoryName;

      const vendorData = {
        businessName: editingVendor.name.trim() || editingVendor.businessName,
        description: editingVendor.description.trim(),
        categories: [editingVendor.categoryId],
        email: editingVendor.email.trim(),
        phone: editingVendor.phone.trim(),
        address: {
          street: editingVendor.address || '',
        },
        businessType: editingVendor.businessType,
        status: editingVendor.status,
        featured: editingVendor.featured,
        isOpen: editingVendor.open,
        commissionRate: editingVendor.commissionRate || 15,
        deliveryRadius: editingVendor.deliveryRadius || 5,
        website: editingVendor.website || '',
      };

      await vendorService.update(editingVendor.id, vendorData);

      alert('Vendor updated successfully!');
      setShowEditVendorModal(false);
      setEditingVendor(null);
      fetchVendors();
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor: ' + (error.displayMessage || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm('Are you sure you want to suspend this vendor?')) return;

    try {
      await vendorService.updateStatus(vendorId, 'suspended');
      alert('Vendor suspended successfully!');
      fetchVendors();
    } catch (error) {
      console.error('Error suspending vendor:', error);
      alert('Failed to suspend vendor: ' + (error.displayMessage || error.message));
    }
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor({ ...vendor });
    setShowEditVendorModal(true);
  };

  const handleViewVendorDetails = (vendor) => {
    setSelectedVendorDetails(vendor);
    setShowVendorDetailsModal(true);
  };

  const handleViewPartnerDetails = (partner) => {
    setSelectedPartnerDetails(partner);
    setShowPartnerDetailsModal(true);
  };

  const handleDeactivateVendor = async (vendorId, currentStatus) => {
    const action = currentStatus === 'approved' ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} this vendor?`)) return;

    try {
      const newStatus = currentStatus === 'approved' ? 'suspended' : 'approved';
      // Temporary no-op
      console.log('dashboardDataService.updateVendorStatus placeholder');

      fetchVendors();
      alert(`Vendor ${action}d successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing vendor:`, error);
      alert(`Failed to ${action} vendor: ` + error.message);
    }
  };

  const resetVendorForm = () => {
    setNewVendor({
      name: '',
      description: '',
      email: '',
      phone: '',
      businessType: 'store',
      address: '',
      status: 'pending',
      categoryId: '',
      categoryName: '',
      rating: 4.5,
      deliveryTime: '30-40',
      deliveryFee: 40,
      minOrder: 150,
      image: '',
      offers: '',
      featured: false,
      open: true,
      hygienePass: true,
      commissionRate: 15,
      deliveryRadius: 5,
      avgPreparationTime: '20-40',
      orderCount: 0,
      totalEarnings: 0,
      website: '',
      isVeg: false,
      cuisine: 'South Indian',
      priceRange: '₹₹',
      medicineType: 'Pharmacy',
      groceryType: 'Supermarket',
      fruitsType: 'Fruits Store',
      meatType: 'Meat Shop',
      dressType: 'Clothing Store',
    });
  };

  const handleAddCategory = async () => {
    try {
      setLoading(true);
      const maxOrder = categories.length > 0
        ? Math.max(...categories.map(cat => cat.order || 0))
        : 0;

      await categoryService.create({
        ...newCategory,
        order: maxOrder + 1
      });

      alert('Category added successfully!');
      setShowAddCategoryModal(false);
      setNewCategory({
        name: '',
        description: '',
        icon: 'Store',
        status: 'active',
        image: '',
        order: 0,
      });

      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category: ' + (error.displayMessage || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      const success = await vendorService.approve(vendorId);
      if (success) {
        alert('Vendor approved successfully!');
        fetchVendors();
      } else {
        alert('Failed to approve vendor.');
      }
    } catch (error) {
      console.error('Error approving vendor:', error);
      alert('Failed to approve vendor: ' + (error.displayMessage || error.message));
    }
  };

  const handleRejectVendor = async (vendorId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      // Temporary no-op
      console.log('dashboardDataService.updateVendorStatus (rejected) placeholder');

      fetchVendors();
      alert('Vendor rejected successfully!');
      setShowRejectionModal(false);
      setRejectionReason('');
      setRejectionVendorId(null);
    } catch (error) {
      console.error('Error rejecting vendor:', error);
      alert('Failed to reject vendor: ' + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      const success = await categoryService.delete(categoryId);
      if (success) {
        alert('Category deleted successfully!');
        fetchCategories();
      } else {
        alert('Failed to delete category.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category: ' + (error.displayMessage || error.message));
    }
  };

  const handleUpdateCategoryStatus = async (categoryId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await categoryService.update(categoryId, { status: newStatus });

      fetchCategories();
      alert(`Category ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
    } catch (error) {
      console.error('Error updating category status:', error);
      alert('Failed to update category status: ' + error.message);
    }
  };

  const handleApprovePartner = async (partnerId) => {
    if (!window.confirm('Are you sure you want to approve this partner?')) return;
    try {
      setLoading(true);
      await deliveryService.approve(partnerId);
      alert('Partner approved successfully!');
      fetchPartners();
    } catch (error) {
      console.error('Error approving partner:', error);
      alert('Failed to approve partner: ' + (error.displayMessage || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPartner = async (partnerId, reason) => {
    let finalReason = reason;
    if (!finalReason) {
      finalReason = prompt('Enter rejection reason:');
      if (!finalReason) return;
    }

    try {
      setLoading(true);
      await deliveryService.reject(partnerId, finalReason);
      alert('Partner rejected successfully!');
      fetchPartners();
    } catch (error) {
      console.error('Error rejecting partner:', error);
      alert('Failed to reject partner: ' + (error.displayMessage || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    if (key === 'clear') {
      setFilters({
        status: 'all',
        category: 'all',
        businessType: 'all',
        dateFrom: '',
        dateTo: '',
        search: ''
      });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const getFilteredVendors = () => {
    return allVendors.filter(vendor => {
      if (filters.status !== 'all' && vendor.status !== filters.status) return false;
      if (filters.category !== 'all' && vendor.categoryId !== filters.category && vendor.category !== filters.category) return false;
      if (filters.businessType !== 'all' && vendor.businessType !== filters.businessType) return false;
      if (filters.dateFrom && vendor.registrationDate < filters.dateFrom) return false;
      if (filters.dateTo && vendor.registrationDate > filters.dateTo) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          vendor.name.toLowerCase().includes(searchTerm) ||
          vendor.email.toLowerCase().includes(searchTerm) ||
          vendor.phone.includes(searchTerm) ||
          vendor.category.toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  };

  const getFilteredPartners = () => {
    return partners.filter(partner => {
      if (filters.status !== 'all' && partner.status !== filters.status) return false;
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          (partner.basicInfo?.name || '').toLowerCase().includes(searchTerm) ||
          (partner.basicInfo?.email || '').toLowerCase().includes(searchTerm) ||
          (partner.basicInfo?.phone || '').includes(searchTerm) ||
          (partner.id || '').toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  };

  const filteredVendors = getFilteredVendors();
  const filteredPartners = getFilteredPartners();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <Header
          activeTab={activeTab}
          filters={filters}
          handleFilterChange={handleFilterChange}
        />

        <main className="p-6">
          {/* Content based on activeTab */}
          {activeTab === 'overview' && (
            <>
              <DashboardStats stats={stats} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders recentOrders={recentOrders} />
                <QuickActions
                  setShowAddVendorModal={setShowAddVendorModal}
                  setShowAddCategoryModal={setShowAddCategoryModal}
                  setActiveTab={setActiveTab}
                  partners={partners}
                />
              </div>
            </>
          )}

          {activeTab === 'vendors' && (
            <VendorsSection
              vendorsLoading={vendorsLoading}
              filteredVendors={filteredVendors}
              allVendors={allVendors}
              filters={filters}
              handleFilterChange={handleFilterChange}
              categories={categories}
              setShowAddVendorModal={setShowAddVendorModal}
              handleViewVendorDetails={handleViewVendorDetails}
              handleEditVendor={handleEditVendor}
              handleDeleteVendor={handleDeleteVendor}
              handleApproveVendor={handleApproveVendor}
              setRejectionVendorId={setRejectionVendorId}
              setShowRejectionModal={setShowRejectionModal}
              handleDeactivateVendor={handleDeactivateVendor}
            />
          )}

          {activeTab === 'partners' && (
            <PartnersSection
              partnersLoading={partnersLoading}
              partners={partners}
              filteredPartners={filteredPartners}
              filters={filters}
              handleFilterChange={handleFilterChange}
              handleViewPartnerDetails={handleViewPartnerDetails}
              handleApprovePartner={handleApprovePartner}
              handleRejectPartner={handleRejectPartner}
            />
          )}

          {activeTab === 'orders' && (
            <OrderManagement
              handleViewOrderDetails={handleViewOrderDetails}
              allVendors={allVendors}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesSection
              categories={categories}
              allVendors={allVendors}
              setShowAddCategoryModal={setShowAddCategoryModal}
              handleUpdateCategoryStatus={handleUpdateCategoryStatus}
              handleDeleteCategory={handleDeleteCategory}
              loading={loading}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsSection allVendors={allVendors} />
          )}

          {['users', 'complaints', 'settings'].includes(activeTab) && (
            <PlaceholderSection />
          )}
        </main>
      </div>

      {/* Modals */}
      <AddVendorModal
        showAddVendorModal={showAddVendorModal}
        setShowAddVendorModal={setShowAddVendorModal}
        newVendor={newVendor}
        setNewVendor={setNewVendor}
        categories={categories}
        handleAddVendor={handleAddVendor}
        loading={loading}
        resetVendorForm={resetVendorForm}
      />
      <EditVendorModal
        showEditVendorModal={showEditVendorModal}
        setShowEditVendorModal={setShowEditVendorModal}
        editingVendor={editingVendor}
        setEditingVendor={setEditingVendor}
        categories={categories}
        handleUpdateVendor={handleUpdateVendor}
      />

      <VendorDetailsModal
        showVendorDetailsModal={showVendorDetailsModal}
        selectedVendorDetails={selectedVendorDetails}
        setShowVendorDetailsModal={setShowVendorDetailsModal}
        setSelectedVendorDetails={setSelectedVendorDetails}
        handleEditVendor={handleEditVendor}
        handleDeleteVendor={handleDeleteVendor}
      />

      <PartnerDetailsModal
        showPartnerDetailsModal={showPartnerDetailsModal}
        selectedPartnerDetails={selectedPartnerDetails}
        setShowPartnerDetailsModal={setShowPartnerDetailsModal}
        setSelectedPartnerDetails={setSelectedPartnerDetails}
        handleApprovePartner={handleApprovePartner}
        handleRejectPartner={handleRejectPartner}
      />

      <AddCategoryModal
        showAddCategoryModal={showAddCategoryModal}
        setShowAddCategoryModal={setShowAddCategoryModal}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
        loading={loading}
      />

      <RejectionModal
        showRejectionModal={showRejectionModal}
        setShowRejectionModal={setShowRejectionModal}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        rejectionVendorId={rejectionVendorId}
        setRejectionVendorId={setRejectionVendorId}
        handleRejectVendor={handleRejectVendor}
      />

      <OrderDetailsModal
        showOrderDetailsModal={showOrderDetailsModal}
        setShowOrderDetailsModal={setShowOrderDetailsModal}
        selectedOrderDetails={selectedOrderDetails}
      />
    </div>
  );
};

export default Dashboard;