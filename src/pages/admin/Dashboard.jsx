
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config.js';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import {
  Users, ShoppingBag, DollarSign, Store, CheckCircle
} from 'lucide-react';

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
        await Promise.all([
          fetchVendors(),
          fetchPartners(),
          fetchCategories(),
          fetchUsers(),
          fetchRecentOrders()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    updateStats();
  }, [allVendors, partners, users, recentOrders]);

  const fetchVendors = async () => {
    try {
      setVendorsLoading(true);
      const vendorsRef = collection(db, 'hotels');
      const q = query(vendorsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const vendorsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const vendor = {
          // Basic Store Details
          id: doc.id,
          name: data.name || 'Unnamed Business',
          ownerName: data.ownerName || '',
          email: data.email || '',
          phone: data.phone || data.mobile || '',
          businessType: data.businessType || 'store',
          businessRegistrationType: data.businessRegistrationType || '',
          applicationId: data.applicationId || 'N/A',
          status: data.status || 'pending',
          verificationStatus: data.verificationStatus || 'pending',
          viewedByAdmin: data.viewedByAdmin || false,
          rejectionReason: data.rejectionReason || '',
          image: data.image || '',
          imageStorageType: data.imageStorageType || '',
          website: data.website || '',
          description: data.description || '',

          // Category Details
          category: data.categoryName || data.category || '',
          categoryName: data.categoryName || data.category || '',
          categoryId: data.categoryId || '',
          medicineType: data.medicineType || '',
          isVeg: data.isVeg || false,

          // Location & Timing
          address: data.address || '',
          operatingCity: data.operatingCity || '',
          openingTime: data.openingTime || '',
          closingTime: data.closingTime || '',
          is24x7: data.is24x7 || false,
          open: data.open !== undefined ? data.open : true,
          avgPreparationTime: data.avgPreparationTime || '20-40',
          deliveryTime: data.deliveryTime || '30-40',

          // Delivery & Service Info
          deliveryAvailable: data.deliveryAvailable !== undefined ? data.deliveryAvailable : true,
          deliveryFee: data.deliveryFee || 0,
          deliveryRadius: data.deliveryRadius || 5,
          fastDelivery: data.fastDelivery || false,
          minOrder: data.minOrder || 0,
          commissionRate: data.commissionRate || 15,

          // Offers & Flags
          offers: data.offers || '',
          discounted: data.discounted || false,
          bestSeller: data.bestSeller || false,
          featured: data.featured || false,
          newArrivals: data.newArrivals || false,
          seasonal: data.seasonal || false,
          todaysCatch: data.todaysCatch || false,
          organic: data.organic || false,
          comboPacks: data.comboPacks || false,
          hygienePass: data.hygienePass !== undefined ? data.hygienePass : true,

          // Medicine / Stock Info
          requiresPrescription: data.requiresPrescription || false,
          inStock: data.inStock !== undefined ? data.inStock : true,
          generic: data.generic || false,

          // Performance Metrics
          rating: data.rating || 0,
          orderCount: data.orderCount || 0,
          totalEarnings: data.totalEarnings || 0,

          // Bank & Payment Details
          accountHolderName: data.accountHolderName || data.holderName || '',
          bankName: data.bankName || '',
          accountNumber: data.accountNumber || '',
          ifscCode: data.ifscCode || '',
          upiId: data.upiId || '',
          branchName: data.branchName || '',

          // Verification Documents
          governmentIdType: data.governmentIdType || '',
          governmentIdNumber: data.governmentIdNumber || '',
          licenseType: data.licenseType || '',
          licenseNumber: data.licenseNumber || '',

          // Legal (Legacy/Duplicate support)
          legalName: data.legalName || '',
          gstNumber: data.gstNumber || '',
          panNumber: data.panNumber || '',
          registeredAddress: data.registeredAddress || '',

          // Filters Object
          filters: data.filters || {},

          // Metadata
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          registrationDate: data.createdAt?.toDate?.().toISOString().split('T')[0] || 'N/A',
        };
        vendorsData.push(vendor);
      });

      setAllVendors(vendorsData);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setVendorsLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      setPartnersLoading(true);
      const partnersRef = collection(db, 'delivery');
      const q = query(partnersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const partnersData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        partnersData.push({
          id: doc.id,
          ...data,
          registrationDate: data.createdAt?.toDate?.().toISOString().split('T')[0] || 'N/A',
          verifiedAtDate: data.verifiedAt?.toDate?.().toLocaleString() || 'N/A',
          updatedAtDate: data.updatedAt?.toDate?.().toLocaleString() || 'N/A',

          status: data.status || 'pending_verification',
          rejectionReason: data.rejectionReason || '',
        });
      });

      setPartners(partnersData);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setPartnersLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);

      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      const usersData = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'), where('createdAt', '>=', new Date(new Date().setHours(0, 0, 0, 0))));
      const querySnapshot = await getDocs(q);

      const ordersData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          ...data,
          // Normalize for table
          orderId: data.orderId || `ORD-${doc.id.slice(0, 8)}`,
          user: data.customerName || data.userName || 'Customer',
          vendor: data.vendorName || data.businessName || 'Vendor',
          amount: data.totalAmount || data.amount || 0,
          formattedAmount: `₹${data.totalAmount || data.amount || 0}`,
          status: data.status || 'placed',
          time: data.createdAt?.toDate?.().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) || 'N/A'
        });
      });

      // Enrich with partner details
      const enrichedOrders = ordersData.map(order => {
        let deliveryPartner = null;
        if (order.deliveryPartnerId) {
          deliveryPartner = partners.find(p => p.id === order.deliveryPartnerId);
        }
        return {
          ...order,
          deliveryPartner: deliveryPartner || { name: 'Unassigned' }
        };
      });

      setRecentOrders(enrichedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setRecentOrders([]);
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrderDetails(order);
    setShowOrderDetailsModal(true);
  };

  const updateStats = () => {
    const totalVendors = allVendors.length;
    const activeVendors = allVendors.filter(v => v.status === 'approved' && v.open !== false).length;
    const totalPartners = partners.length;
    const totalUsers = users.length;
    const todayOrders = recentOrders.length;
    const totalRevenue = allVendors.reduce((sum, vendor) => sum + (vendor.totalEarnings || 0), 0);

    setStats([
      { title: 'Total Users', value: totalUsers.toString(), icon: <Users className="w-6 h-6" />, color: 'bg-blue-500', change: '+0%' },
      { title: 'Total Vendors', value: totalVendors.toString(), icon: <Store className="w-6 h-6" />, color: 'bg-green-500', change: '+0%' },
      { title: 'Active Vendors', value: activeVendors.toString(), icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-500', change: '+0%' },
      { title: 'Total Partners', value: totalPartners.toString(), icon: <Users className="w-6 h-6" />, color: 'bg-yellow-500', change: '+0' },
      { title: "Today's Orders", value: todayOrders.toString(), icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-purple-500', change: '+0%' },
      { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: <DollarSign className="w-6 h-6" />, color: 'bg-indigo-500', change: '+0%' },
    ]);
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
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'hotels'), vendorData);

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
        name: editingVendor.name.trim(),
        description: editingVendor.description.trim(),
        categoryId: editingVendor.categoryId,
        categoryName: categoryName,
        email: editingVendor.email.trim(),
        phone: editingVendor.phone.trim(),
        address: editingVendor.address.trim(),
        rating: parseFloat(editingVendor.rating) || 4.5,
        deliveryTime: editingVendor.deliveryTime.trim(),
        deliveryFee: parseFloat(editingVendor.deliveryFee) || 40,
        minOrder: parseFloat(editingVendor.minOrder) || 150,
        businessType: editingVendor.businessType,

        ...(categoryName === 'Food' && {
          cuisine: editingVendor.cuisine,
          priceRange: editingVendor.priceRange,
          isVeg: editingVendor.isVeg
        }),
        ...(categoryName === 'Medicine' && {
          medicineType: editingVendor.medicineType,
        }),
        ...(categoryName === 'Groceries' && {
          groceryType: editingVendor.groceryType,
        }),
        ...(categoryName === 'Fruits & Vegetables' && {
          fruitsType: editingVendor.fruitsType,
        }),
        ...(categoryName === 'Meat & Fish' && {
          meatType: editingVendor.meatType,
        }),
        ...(categoryName === 'Dress & Gadgets' && {
          dressType: editingVendor.dressType,
          priceRange: editingVendor.priceRange,
        }),

        image: editingVendor.image,
        offers: editingVendor.offers,
        status: editingVendor.status,
        featured: editingVendor.featured,
        open: editingVendor.open,
        hygienePass: editingVendor.hygienePass,
        commissionRate: editingVendor.commissionRate || 15,
        deliveryRadius: editingVendor.deliveryRadius || 5,
        website: editingVendor.website || '',
        updatedAt: serverTimestamp(),
      };

      await updateDoc(doc(db, 'hotels', editingVendor.id), vendorData);

      alert('Vendor updated successfully!');
      setShowEditVendorModal(false);
      setEditingVendor(null);
      fetchVendors();
    } catch (error) {
      console.error('Error updating vendor:', error);
      alert('Failed to update vendor: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (!window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) return;

    try {
      await deleteDoc(doc(db, 'hotels', vendorId));
      alert('Vendor deleted successfully!');
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('Failed to delete vendor: ' + error.message);
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
      const vendorRef = doc(db, 'hotels', vendorId);
      await updateDoc(vendorRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

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

      const categoryData = {
        ...newCategory,
        order: maxOrder + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      };

      await addDoc(collection(db, 'categories'), categoryData);

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
      alert('Failed to add category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      const vendorRef = doc(db, 'hotels', vendorId);
      await updateDoc(vendorRef, {
        status: 'approved',
        open: true,
        updatedAt: serverTimestamp(),
      });

      fetchVendors();
      alert('Vendor approved successfully!');
    } catch (error) {
      console.error('Error approving vendor:', error);
      alert('Failed to approve vendor: ' + error.message);
    }
  };

  const handleRejectVendor = async (vendorId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      const vendorRef = doc(db, 'hotels', vendorId);
      await updateDoc(vendorRef, {
        status: 'rejected',
        open: false,
        rejectionReason: rejectionReason.trim(),
        updatedAt: serverTimestamp(),
      });

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
      await deleteDoc(doc(db, 'categories', categoryId));
      fetchCategories();
      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category: ' + error.message);
    }
  };

  const handleUpdateCategoryStatus = async (categoryId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const categoryRef = doc(db, 'categories', categoryId);
      await updateDoc(categoryRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

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
      const partnerRef = doc(db, 'delivery', partnerId);
      await updateDoc(partnerRef, {
        status: 'approved',
        verifiedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      fetchPartners();
      alert('Partner approved successfully!');
    } catch (error) {
      console.error('Error approving partner:', error);
      alert('Failed to approve partner: ' + error.message);
    }
  };

  const handleRejectPartner = async (partnerId, reason) => {
    // If reason is not provided (e.g. called directly), prompt for it
    let finalReason = reason;
    if (!finalReason) {
      finalReason = prompt('Enter rejection reason:');
      if (!finalReason) return; // Cancelled
    }

    try {
      const partnerRef = doc(db, 'delivery', partnerId);
      await updateDoc(partnerRef, {
        status: 'rejected',
        rejectionReason: finalReason,
        updatedAt: serverTimestamp(),
      });
      fetchPartners();
      alert('Partner rejected successfully!');
    } catch (error) {
      console.error('Error rejecting partner:', error);
      alert('Failed to reject partner: ' + error.message);
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