/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Users,
  Store,
  CheckCircle,
  Clock,
  ShoppingBag,
  DollarSign,
  AlertCircle,
  Download,
  Eye,
  XCircle,
  MoreVertical,
  TrendingUp,
  Filter,
  Search,
  Settings,
  Folder,
  DatabaseBackup,
  View,
  Plus,
  Trash2,
  Edit,
  Utensils,
  ShoppingCart,
  Apple,
  Beef,
  Pill,
  Hash,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  FileText,
  Shield,
  Banknote,
  CreditCard,
  Package,
  Truck,
  Star,
  Award,
  Bell,
  BarChart3
} from 'lucide-react';
import { db } from "../../firebase/firebase.config"
// eslint-disable-next-line no-unused-vars
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [vendorsLoading, setVendorsLoading] = useState(false);
  const [partnersLoading, setPartnersLoading] = useState(false);

  // States for dynamic data
  const [stats, setStats] = useState([
    { title: 'Total Users', value: '0', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500', change: '+0%' },
    { title: 'Total Vendors', value: '0', icon: <Store className="w-6 h-6" />, color: 'bg-green-500', change: '+0%' },
    { title: 'Active Vendors', value: '0', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-500', change: '+0%' },
    { title: 'Total Partners', value: '0', icon: <Users className="w-6 h-6" />, color: 'bg-yellow-500', change: '+0' },
    { title: "Today's Orders", value: '0', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-purple-500', change: '+0%' },
    { title: 'Total Revenue', value: '₹0', icon: <DollarSign className="w-6 h-6" />, color: 'bg-indigo-500', change: '+0%' },
  ]);

  const [allVendors, setAllVendors] = useState([]);
  const [partners, setPartners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    businessType: 'all',
    dateFrom: '',
    dateTo: '',
    search: ''
  });

  // Modal states
  const [editingVendor, setEditingVendor] = useState(null);
  const [selectedVendorDetails, setSelectedVendorDetails] = useState(null);
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showEditVendorModal, setShowEditVendorModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionVendorId, setRejectionVendorId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);

  // States for adding new vendor
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

  // States for adding new category
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'Store',
    status: 'active',
    image: '',
    order: 0,
  });

  // Fetch all data from Firebase
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

  // Update stats when data changes
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
          id: doc.id,
          name: data.name || 'Unnamed Business',
          email: data.email || '',
          phone: data.phone || data.mobile || '',
          businessType: data.businessType || 'store',
          address: data.address || '',
          status: data.status || 'pending',
          category: data.categoryName || data.category || '',
          categoryId: data.categoryId || '',
          rating: data.rating || 0,
          deliveryTime: data.deliveryTime || '30-40',
          image: data.image || '',
          registrationDate: data.createdAt?.toDate?.().toISOString().split('T')[0] || 'N/A',
          createdAt: data.createdAt,
          totalEarnings: data.totalEarnings || 0,
          orderCount: data.orderCount || 0,
          description: data.description || '',
          offers: data.offers || '',
          featured: data.featured || false,
          open: data.open !== undefined ? data.open : true,
          hygienePass: data.hygienePass !== undefined ? data.hygienePass : true,
          website: data.website || '',
          commissionRate: data.commissionRate || 15,
          deliveryRadius: data.deliveryRadius || 5,
          isVeg: data.isVeg || false,
          cuisine: data.cuisine || '',
          priceRange: data.priceRange || '',
          medicineType: data.medicineType || '',
          groceryType: data.groceryType || '',
          fruitsType: data.fruitsType || '',
          meatType: data.meatType || '',
          dressType: data.dressType || '',
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
      const partnersRef = collection(db, 'partners');
      const q = query(partnersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const partnersData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        partnersData.push({
          id: doc.id,
          ...data,
          registrationDate: data.createdAt?.toDate?.().toISOString().split('T')[0] || 'N/A'
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
      const q = query(ordersRef, orderBy('createdAt', 'desc'), where('orderDate', '>=', new Date(new Date().setHours(0, 0, 0, 0))));
      const querySnapshot = await getDocs(q);

      const ordersData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: data.orderId || `ORD-${doc.id.slice(0, 8)}`,
          user: data.customerName || 'Customer',
          vendor: data.vendorName || 'Vendor',
          amount: `₹${data.totalAmount || 0}`,
          status: data.status || 'placed',
          time: data.createdAt?.toDate?.().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) || 'N/A'
        });
      });
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Set empty array if no orders
      setRecentOrders([]);
    }
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
          (partner.name || '').toLowerCase().includes(searchTerm) ||
          (partner.email || '').toLowerCase().includes(searchTerm) ||
          (partner.phone || '').includes(searchTerm) ||
          (partner.partnerType || '').toLowerCase().includes(searchTerm)
        );
      }
      return true;
    });
  };

  const renderBusinessSpecificFields = (vendorData, isEditing = false) => {
    const categoryName = isEditing ? editingVendor?.categoryName :
      categories.find(cat => cat.id === vendorData.categoryId)?.name || vendorData.categoryName;

    switch (categoryName) {
      case 'Food':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Restaurant Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Cuisine *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.cuisine : vendorData.cuisine}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, cuisine: e.target.value }) :
                    setNewVendor({ ...newVendor, cuisine: e.target.value })}
                >
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Multi-Cuisine">Multi-Cuisine</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.priceRange : vendorData.priceRange}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, priceRange: e.target.value }) :
                    setNewVendor({ ...newVendor, priceRange: e.target.value })}
                >
                  <option value="₹">Budget (₹)</option>
                  <option value="₹₹">Moderate (₹₹)</option>
                  <option value="₹₹₹">Premium (₹₹₹)</option>
                  <option value="₹₹₹₹">Luxury (₹₹₹₹)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl flex-1">
                <input
                  type="checkbox"
                  checked={isEditing ? editingVendor.isVeg : vendorData.isVeg}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, isVeg: e.target.checked }) :
                    setNewVendor({ ...newVendor, isVeg: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Pure Vegetarian
                </label>
              </div>
            </div>
          </div>
        );

      case 'Medicine':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Medical Store Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.medicineType : vendorData.medicineType}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, medicineType: e.target.value }) :
                    setNewVendor({ ...newVendor, medicineType: e.target.value })}
                >
                  <option value="Pharmacy">General Pharmacy</option>
                  <option value="24x7 Pharmacy">24x7 Pharmacy</option>
                  <option value="Generic Medicine Store">Generic Medicine Store</option>
                  <option value="Ayurvedic Store">Ayurvedic Store</option>
                  <option value="Homeopathic Store">Homeopathic Store</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'Groceries':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Grocery Store Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.groceryType : vendorData.groceryType}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, groceryType: e.target.value }) :
                    setNewVendor({ ...newVendor, groceryType: e.target.value })}
                >
                  <option value="Supermarket">Supermarket</option>
                  <option value="Kirana Store">Kirana Store</option>
                  <option value="Organic Store">Organic Store</option>
                  <option value="Bulk Store">Bulk Store</option>
                  <option value="Convenience Store">Convenience Store</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'Fruits & Vegetables':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Fruits & Vegetables Store Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.fruitsType : vendorData.fruitsType}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, fruitsType: e.target.value }) :
                    setNewVendor({ ...newVendor, fruitsType: e.target.value })}
                >
                  <option value="Fruits Store">Fruits Store</option>
                  <option value="Vegetables Store">Vegetables Store</option>
                  <option value="Fruits & Vegetables">Both Fruits & Vegetables</option>
                  <option value="Organic Store">Organic Store</option>
                  <option value="Juice Center">Juice Center</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'Meat & Fish':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Meat & Fish Shop Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Shop Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.meatType : vendorData.meatType}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, meatType: e.target.value }) :
                    setNewVendor({ ...newVendor, meatType: e.target.value })}
                >
                  <option value="Meat Shop">Meat Shop</option>
                  <option value="Fish Shop">Fish Shop</option>
                  <option value="Both Meat & Fish">Both Meat & Fish</option>
                  <option value="Chicken Speciality">Chicken Speciality</option>
                  <option value="Mutton Speciality">Mutton Speciality</option>
                  <option value="Seafood">Seafood Shop</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'Dress & Gadgets':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Dress & Gadgets Store Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Store Type *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.dressType : vendorData.dressType}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, dressType: e.target.value }) :
                    setNewVendor({ ...newVendor, dressType: e.target.value })}
                >
                  <option value="Clothing Store">Clothing Store</option>
                  <option value="Electronics Store">Electronics Store</option>
                  <option value="Both Clothing & Electronics">Both Clothing & Electronics</option>
                  <option value="Mobile Store">Mobile Store</option>
                  <option value="Footwear Store">Footwear Store</option>
                  <option value="Accessories Store">Accessories Store</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range *</label>
                <select
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  value={isEditing ? editingVendor.priceRange : vendorData.priceRange}
                  onChange={(e) => isEditing ?
                    setEditingVendor({ ...editingVendor, priceRange: e.target.value }) :
                    setNewVendor({ ...newVendor, priceRange: e.target.value })}
                >
                  <option value="Budget">Budget</option>
                  <option value="Mid Range">Mid Range</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Vendor Details Modal
  const renderVendorDetailsModal = () => {
    if (!showVendorDetailsModal || !selectedVendorDetails) return null;

    const vendor = selectedVendorDetails;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Vendor Details</h3>
              <button
                onClick={() => {
                  setShowVendorDetailsModal(false);
                  setSelectedVendorDetails(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">{vendor.name}</h4>
                    <p className="text-sm text-gray-600">Vendor ID: {vendor.id}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm rounded-full ${vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                      vendor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        vendor.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                    {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Registration Date</p>
                    <p className="font-medium">{vendor.registrationDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-medium">{vendor.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Business Type</p>
                    <p className="font-medium">{vendor.businessType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Rating</p>
                    <p className="font-medium">{vendor.rating} ⭐</p>
                  </div>
                </div>
              </div>

              {/* Contact & Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{vendor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{vendor.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{vendor.address}</p>
                      </div>
                    </div>
                    {vendor.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <p className="font-medium">{vendor.website}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Business Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="font-medium">{vendor.description || 'No description provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Special Offers</p>
                      <p className="font-medium">{vendor.offers || 'No offers'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Commission Rate</p>
                        <p className="font-medium">{vendor.commissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivery Radius</p>
                        <p className="font-medium">{vendor.deliveryRadius} km</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery & Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Delivery Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Delivery Time</p>
                      <p className="font-medium">{vendor.deliveryTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Fee</p>
                      <p className="font-medium">₹{vendor.deliveryFee}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Minimum Order</p>
                      <p className="font-medium">₹{vendor.minOrder}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Avg Preparation Time</p>
                      <p className="font-medium">{vendor.avgPreparationTime || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 border-b pb-2">Performance Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="font-medium">{vendor.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Earnings</p>
                      <p className="font-medium">₹{vendor.totalEarnings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${vendor.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {vendor.open ? 'Open' : 'Closed'}
                        </span>
                        {vendor.featured && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hygiene Pass</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${vendor.hygienePass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {vendor.hygienePass ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Specific Details */}
              {vendor.category === 'Food' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Restaurant Details</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Cuisine</p>
                      <p className="font-medium">{vendor.cuisine}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price Range</p>
                      <p className="font-medium">{vendor.priceRange}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Pure Vegetarian</p>
                      <p className="font-medium">{vendor.isVeg ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              )}

              {vendor.category === 'Medicine' && vendor.medicineType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Medical Store Details</h4>
                  <div>
                    <p className="text-sm text-gray-500">Store Type</p>
                    <p className="font-medium">{vendor.medicineType}</p>
                  </div>
                </div>
              )}

              {vendor.category === 'Groceries' && vendor.groceryType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Grocery Store Details</h4>
                  <div>
                    <p className="text-sm text-gray-500">Store Type</p>
                    <p className="font-medium">{vendor.groceryType}</p>
                  </div>
                </div>
              )}

              {vendor.category === 'Fruits & Vegetables' && vendor.fruitsType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Fruits & Vegetables Store Details</h4>
                  <div>
                    <p className="text-sm text-gray-500">Store Type</p>
                    <p className="font-medium">{vendor.fruitsType}</p>
                  </div>
                </div>
              )}

              {vendor.category === 'Meat & Fish' && vendor.meatType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Meat & Fish Shop Details</h4>
                  <div>
                    <p className="text-sm text-gray-500">Shop Type</p>
                    <p className="font-medium">{vendor.meatType}</p>
                  </div>
                </div>
              )}

              {vendor.category === 'Dress & Gadgets' && vendor.dressType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Dress & Gadgets Store Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Store Type</p>
                      <p className="font-medium">{vendor.dressType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Price Range</p>
                      <p className="font-medium">{vendor.priceRange}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-6 border-t">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowVendorDetailsModal(false);
                      handleEditVendor(vendor);
                    }}
                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                  >
                    Edit Vendor
                  </button>
                  <button
                    onClick={() => {
                      setShowVendorDetailsModal(false);
                      if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
                        handleDeleteVendor(vendor.id);
                      }
                    }}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete Vendor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rejection Modal
  const renderRejectionModal = () => {
    if (!showRejectionModal) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Reject Vendor</h3>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setRejectionVendorId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please provide reason for rejection *
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  rows="4"
                  placeholder="Enter detailed reason for rejection..."
                  required
                />
              </div>

              <div className="pt-4 border-t flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                    setRejectionVendorId(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectVendor(rejectionVendorId)}
                  disabled={!rejectionReason.trim()}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject Vendor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add Vendor Modal
  const renderAddVendorModal = () => {
    if (!showAddVendorModal) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add New Business/Vendor</h3>
              <button
                onClick={() => {
                  setShowAddVendorModal(false);
                  resetVendorForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="business@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={newVendor.categoryId}
                    onChange={(e) => {
                      const selectedCat = categories.find(cat => cat.id === e.target.value);
                      setNewVendor({
                        ...newVendor,
                        categoryId: e.target.value,
                        categoryName: selectedCat ? selectedCat.name : '',
                        cuisine: 'South Indian',
                        priceRange: '₹₹',
                        medicineType: 'Pharmacy',
                        groceryType: 'Supermarket',
                        fruitsType: 'Fruits Store',
                        meatType: 'Meat Shop',
                        dressType: 'Clothing Store',
                        isVeg: false,
                      });
                    }}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newVendor.description}
                  onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  rows="2"
                  placeholder="Brief description about the business"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  value={newVendor.address}
                  onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  rows="2"
                  placeholder="Full address with city and pincode"
                />
              </div>

              {/* Business Specific Fields */}
              {newVendor.categoryId && renderBusinessSpecificFields(newVendor, false)}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                  <select
                    value={newVendor.businessType}
                    onChange={(e) => setNewVendor({ ...newVendor, businessType: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  >
                    <option value="restaurant">Restaurant</option>
                    <option value="store">Store</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    value={newVendor.rating}
                    onChange={(e) => setNewVendor({ ...newVendor, rating: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={newVendor.deliveryTime}
                    onChange={(e) => setNewVendor({ ...newVendor, deliveryTime: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="30-40 min"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={newVendor.deliveryFee}
                    onChange={(e) => setNewVendor({ ...newVendor, deliveryFee: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    value={newVendor.minOrder}
                    onChange={(e) => setNewVendor({ ...newVendor, minOrder: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="150"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    value={newVendor.commissionRate}
                    onChange={(e) => setNewVendor({ ...newVendor, commissionRate: parseInt(e.target.value) })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    min="0"
                    max="50"
                    placeholder="15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                  <input
                    type="number"
                    value={newVendor.deliveryRadius}
                    onChange={(e) => setNewVendor({ ...newVendor, deliveryRadius: parseInt(e.target.value) })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    min="1"
                    max="20"
                    placeholder="5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newVendor.image}
                  onChange={(e) => setNewVendor({ ...newVendor, image: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Offers</label>
                <input
                  type="text"
                  value={newVendor.offers}
                  onChange={(e) => setNewVendor({ ...newVendor, offers: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  placeholder="20% OFF on first order, Free delivery above ₹300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newVendor.status}
                    onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="text"
                    value={newVendor.website}
                    onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="https://business.com"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={handleAddVendor}
                  disabled={loading || !newVendor.name || !newVendor.email || !newVendor.phone || !newVendor.categoryId}
                  className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Business...' : 'Add Business'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Vendor Modal
  const renderEditVendorModal = () => {
    if (!showEditVendorModal || !editingVendor) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Edit Business: {editingVendor.name}</h3>
              <button
                onClick={() => {
                  setShowEditVendorModal(false);
                  setEditingVendor(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                  <input
                    type="text"
                    value={editingVendor.name}
                    onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="Enter business name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={editingVendor.email}
                    onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="business@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={editingVendor.phone}
                    onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                    placeholder="9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={editingVendor.categoryId}
                    onChange={(e) => {
                      const selectedCat = categories.find(cat => cat.id === e.target.value);
                      setEditingVendor({
                        ...editingVendor,
                        categoryId: e.target.value,
                        categoryName: selectedCat ? selectedCat.name : '',
                        cuisine: 'South Indian',
                        priceRange: '₹₹',
                        medicineType: 'Pharmacy',
                        groceryType: 'Supermarket',
                        fruitsType: 'Fruits Store',
                        meatType: 'Meat Shop',
                        dressType: 'Clothing Store',
                        isVeg: false,
                      });
                    }}
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={editingVendor.description}
                onChange={(e) => setEditingVendor({ ...editingVendor, description: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                rows="2"
                placeholder="Brief description about the business"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                value={editingVendor.address}
                onChange={(e) => setEditingVendor({ ...editingVendor, address: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                rows="2"
                placeholder="Full address with city and pincode"
              />
            </div>

            {/* Business Specific Fields for Edit */}
            {editingVendor.categoryId && renderBusinessSpecificFields(editingVendor, true)}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                <select
                  value={editingVendor.businessType}
                  onChange={(e) => setEditingVendor({ ...editingVendor, businessType: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                >
                  <option value="restaurant">Restaurant</option>
                  <option value="store">Store</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <input
                  type="number"
                  value={editingVendor.rating}
                  onChange={(e) => setEditingVendor({ ...editingVendor, rating: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                <input
                  type="text"
                  value={editingVendor.deliveryTime}
                  onChange={(e) => setEditingVendor({ ...editingVendor, deliveryTime: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  placeholder="30-40 min"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                <input
                  type="number"
                  value={editingVendor.deliveryFee}
                  onChange={(e) => setEditingVendor({ ...editingVendor, deliveryFee: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  placeholder="40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                <input
                  type="number"
                  value={editingVendor.minOrder}
                  onChange={(e) => setEditingVendor({ ...editingVendor, minOrder: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  placeholder="150"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                <input
                  type="number"
                  value={editingVendor.commissionRate}
                  onChange={(e) => setEditingVendor({ ...editingVendor, commissionRate: parseInt(e.target.value) })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  min="0"
                  max="50"
                  placeholder="15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                <input
                  type="number"
                  value={editingVendor.deliveryRadius}
                  onChange={(e) => setEditingVendor({ ...editingVendor, deliveryRadius: parseInt(e.target.value) })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  min="1"
                  max="20"
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                value={editingVendor.image}
                onChange={(e) => setEditingVendor({ ...editingVendor, image: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Special Offers</label>
              <input
                type="text"
                value={editingVendor.offers}
                onChange={(e) => setEditingVendor({ ...editingVendor, offers: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                placeholder="20% OFF on first order, Free delivery above ₹300"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editingVendor.status}
                  onChange={(e) => setEditingVendor({ ...editingVendor, status: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="suspended">Suspended</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="text"
                  value={editingVendor.website}
                  onChange={(e) => setEditingVendor({ ...editingVendor, website: e.target.value })}
                  className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                  placeholder="https://business.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="editFeatured"
                  checked={editingVendor.featured}
                  onChange={(e) => setEditingVendor({ ...editingVendor, featured: e.target.checked })}
                  className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                />
                <label htmlFor="editFeatured" className="text-sm font-medium text-gray-700">
                  Featured
                </label>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="editOpen"
                  checked={editingVendor.open}
                  onChange={(e) => setEditingVendor({ ...editingVendor, open: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="editOpen" className="text-sm font-medium text-gray-700">
                  Currently Open
                </label>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="editHygienePass"
                  checked={editingVendor.hygienePass}
                  onChange={(e) => setEditingVendor({ ...editingVendor, hygienePass: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="editHygienePass" className="text-sm font-medium text-gray-700">
                  Hygiene Pass
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={handleUpdateVendor}
                disabled={loading || !editingVendor.name || !editingVendor.email || !editingVendor.phone || !editingVendor.categoryId}
                className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating Business...' : 'Update Business'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  };

  // Add Category Modal
  const renderAddCategoryModal = () => {
    if (!showAddCategoryModal) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add New Category</h3>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="e.g., Grocery, Food, Pharmacy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  rows="2"
                  placeholder="Brief description about the category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Store">Store</option>
                  <option value="ShoppingBag">Shopping Bag</option>
                  <option value="CheckCircle">Check Circle</option>
                  <option value="Folder">Folder</option>
                  <option value="Utensils">Utensils</option>
                  <option value="Pill">Pill</option>
                  <option value="ShoppingCart">Shopping Cart</option>
                  <option value="Apple">Apple</option>
                  <option value="Beef">Beef</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newCategory.image}
                  onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newCategory.status}
                  onChange={(e) => setNewCategory({ ...newCategory, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={handleAddCategory}
                  disabled={loading || !newCategory.name}
                  className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Adding Category...' : 'Add Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filteredVendors = getFilteredVendors();
  const filteredPartners = getFilteredPartners();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">KOODAI HUB</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <nav className="p-2">
          {[
            { id: 'overview', label: 'Dashboard', icon: <View className="w-5 h-5" /> },
            { id: 'vendors', label: 'Vendor Management', icon: <Store className="w-5 h-5" /> },
            { id: 'partners', label: 'Partner Management', icon: <Users className="w-5 h-5" /> },
            { id: 'orders', label: 'Order Management', icon: <ShoppingBag className="w-5 h-5" /> },
            { id: 'categories', label: 'Category Management', icon: <Folder className="w-5 h-5" /> },
            { id: 'payments', label: 'Payments', icon: <DollarSign className="w-5 h-5" /> },
            { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
            { id: 'complaints', label: 'Complaints', icon: <AlertCircle className="w-5 h-5" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 my-1 rounded-lg transition-colors ${activeTab === item.id
                  ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-sm text-gray-500">Welcome back, Admin</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-700 font-semibold">A</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">

          {/* DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                        {stat.icon}
                      </div>
                      <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {stat.change}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mt-4">{stat.value}</h3>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                      <p className="text-sm text-gray-500">Latest customer orders</p>
                    </div>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                  <div className="space-y-3">
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No recent orders
                      </div>
                    ) : (
                      recentOrders.slice(0, 4).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <div>
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-800">{order.id}</span>
                              <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{order.user} → {order.vendor}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-800">{order.amount}</p>
                            <p className="text-xs text-gray-500">{order.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setShowAddVendorModal(true)}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <Store className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Add Business</span>
                    </button>
                    <button
                      onClick={() => setShowAddCategoryModal(true)}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <Folder className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Add Category</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('partners')}
                      className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">View Partners ({partners.length})</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                        <Download className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Reports</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* VENDOR MANAGEMENT */}
          {activeTab === 'vendors' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Business Management</h3>
                    <p className="text-sm text-gray-500">Approve and manage businesses</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition">
                      Export
                    </button>
                    <button
                      onClick={() => setShowAddVendorModal(true)}
                      className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Business
                    </button>
                  </div>
                </div>

                {/* Enhanced Filters */}
                <div className="flex items-center space-x-4 mt-4 flex-wrap gap-2">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    value={filters.businessType}
                    onChange={(e) => handleFilterChange('businessType', e.target.value)}
                  >
                    <option value="all">All Business Types</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="store">Store</option>
                  </select>


                  <button
                    onClick={() => setFilters({
                      status: 'all',
                      category: 'all',
                      businessType: 'all',
                      dateFrom: '',
                      dateTo: '',
                      search: ''
                    })}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Vendor Table */}
              <div className="overflow-x-auto">
                {vendorsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading businesses...</p>
                  </div>
                ) : (
                  <>
                    <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
                      Showing {filteredVendors.length} of {allVendors.length} businesses
                    </div>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category / Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredVendors.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                              No businesses found matching your filters
                            </td>
                          </tr>
                        ) : (
                          filteredVendors.map((vendor) => (
                            <tr key={vendor.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{vendor.name}</div>
                                <div className="text-xs text-gray-500">{vendor.businessType === 'restaurant' ? 'Restaurant' : 'Store'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{vendor.email}</div>
                                <div className="text-sm text-gray-500">{vendor.phone}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                    {vendor.category}
                                  </span>
                                  {vendor.cuisine && (
                                    <div className="text-xs text-gray-500">Cuisine: {vendor.cuisine}</div>
                                  )}
                                  {vendor.medicineType && (
                                    <div className="text-xs text-gray-500">Type: {vendor.medicineType}</div>
                                  )}
                                  {vendor.groceryType && (
                                    <div className="text-xs text-gray-500">Type: {vendor.groceryType}</div>
                                  )}
                                  {vendor.fruitsType && (
                                    <div className="text-xs text-gray-500">Type: {vendor.fruitsType}</div>
                                  )}
                                  {vendor.meatType && (
                                    <div className="text-xs text-gray-500">Type: {vendor.meatType}</div>
                                  )}
                                  {vendor.dressType && (
                                    <div className="text-xs text-gray-500">Type: {vendor.dressType}</div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                      vendor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                  }`}>
                                  {vendor.status}
                                </span>
                                {vendor.open === false && (
                                  <span className="ml-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                    Closed
                                  </span>
                                )}
                                {vendor.featured && (
                                  <span className="ml-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                    Featured
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {vendor.registrationDate}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleViewVendorDetails(vendor)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                    title="View Details"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEditVendor(vendor)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVendor(vendor.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  {vendor.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handleApproveVendor(vendor.id)}
                                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => {
                                          setRejectionVendorId(vendor.id);
                                          setShowRejectionModal(true);
                                        }}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                      >
                                        <XCircle className="w-4 h-4" />
                                      </button>
                                    </>
                                  )}
                                  {vendor.status === 'approved' && (
                                    <button
                                      onClick={() => handleDeactivateVendor(vendor.id, vendor.status)}
                                      className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
                                    >
                                      Deactivate
                                    </button>
                                  )}
                                  {vendor.status === 'suspended' && (
                                    <button
                                      onClick={() => handleDeactivateVendor(vendor.id, vendor.status)}
                                      className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                                    >
                                      Activate
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}

          {/* PARTNER MANAGEMENT */}
          {activeTab === 'partners' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Partner Management</h3>
                    <p className="text-sm text-gray-500">Manage delivery partners and affiliates</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition">
                      Export
                    </button>
                    <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Partner
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center space-x-4 mt-4 flex-wrap gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search partners by name, email, or ID..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>

                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                  </select>

                  <button
                    onClick={() => setFilters({
                      status: 'all',
                      category: 'all',
                      businessType: 'all',
                      dateFrom: '',
                      dateTo: '',
                      search: ''
                    })}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Partners Table */}
              <div className="overflow-x-auto">
                {partnersLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading partners...</p>
                  </div>
                ) : (
                  <>
                    <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
                      Showing {filteredPartners.length} of {partners.length} partners
                    </div>
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredPartners.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                              No partners found matching your filters
                            </td>
                          </tr>
                        ) : (
                          filteredPartners.map((partner) => (
                            <tr key={partner.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-900">{partner.name || 'N/A'}</div>
                                <div className="text-xs text-gray-500">ID: {partner.id.substring(0, 8)}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{partner.email || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{partner.phone || 'N/A'}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                  {partner.partnerType || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${partner.status === 'active' ? 'bg-green-100 text-green-800' :
                                    partner.status === 'inactive' ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {partner.status || 'N/A'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {partner.registrationDate || 'N/A'}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Order Management</h3>
                    <p className="text-sm text-gray-500">Monitor and control orders</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Search Order ID..."
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                    <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition">
                      Export Orders
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200">
                {[
                  { label: 'Total Orders', value: recentOrders.length, color: 'bg-blue-500' },
                  { label: 'Pending', value: recentOrders.filter(o => o.status === 'placed' || o.status === 'preparing').length, color: 'bg-yellow-500' },
                  { label: 'Delivered', value: recentOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
                  { label: 'Cancelled', value: recentOrders.filter(o => o.status === 'cancelled').length, color: 'bg-red-500' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`h-1 ${stat.color} rounded-full mb-2`}></div>
                    <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Order Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.user}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.vendor}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                  order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                              }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Paid
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                                View
                              </button>
                              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATEGORY MANAGEMENT */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Category Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-2xl font-bold text-gray-800">{categories.length}</div>
                  <div className="text-sm text-gray-500">Total Categories</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-2xl font-bold text-gray-800">
                    {categories.filter(cat => cat.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-500">Active Categories</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="text-2xl font-bold text-gray-800">
                    {allVendors.length}
                  </div>
                  <div className="text-sm text-gray-500">Total Businesses</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add New Category
                </button>
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Category Management</h3>
                <p className="text-sm text-gray-500">Control what businesses can sell</p>
              </div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="text-gray-500 mt-4">Loading categories...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {categories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-800">{category.name}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {category.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">Order: {category.order}</div>
                      <div className="text-sm text-gray-600 mb-4">
                        Businesses: {allVendors.filter(v => v.category === category.name || v.categoryId === category.id).length}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleUpdateCategoryStatus(category.id, category.status)}
                          className={`flex-1 py-2 text-sm rounded-lg flex items-center justify-center gap-2 ${category.status === 'active'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                        >
                          {category.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Payment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `₹${allVendors.reduce((sum, v) => sum + (v.totalEarnings || 0), 0).toLocaleString()}`, color: 'bg-green-500' },
                { label: 'Platform Commission', value: `₹${allVendors.reduce((sum, v) => sum + ((v.totalEarnings || 0) * ((v.commissionRate || 15) / 100)), 0).toLocaleString()}`, color: 'bg-blue-500' },
                { label: 'Pending Payouts', value: '₹0', color: 'bg-yellow-500' },
                { label: 'Completed Payouts', value: '₹0', color: 'bg-purple-500' },
              ].map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className={`h-1 ${stat.color} rounded-full mb-4`}></div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Payouts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Business Payouts</h3>
                <p className="text-sm text-gray-500">Handle money flow</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allVendors.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          No payout data available
                        </td>
                      </tr>
                    ) : (
                      allVendors.slice(0, 5).map((vendor, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">₹{vendor.totalEarnings || 0}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800`}>
                              Pending
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">Bank Transfer</td>
                          <td className="px-6 py-4 text-sm text-gray-500">2024-01-20</td>
                          <td className="px-6 py-4">
                            {vendor.totalEarnings > 0 ? (
                              <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600">
                                Release Payout
                              </button>
                            ) : (
                              <span className="text-sm text-gray-500">No earnings</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would follow similar structure */}
        {['users', 'complaints', 'settings'].includes(activeTab) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-3xl mb-4">🚧</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )}

      </main>
    </div>

    {/* Modals */}
    {renderAddVendorModal()}
    {renderEditVendorModal()}
    {renderAddCategoryModal()}
    {renderVendorDetailsModal()}
    {renderRejectionModal()}
  </div>
);
};

export default Dashboard;