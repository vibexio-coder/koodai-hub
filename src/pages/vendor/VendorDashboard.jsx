/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X,
  AlertCircle,
  Grid,
  List,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  MoreVertical,
  Settings,
  LogOut,
  Home,
  Star,
  Tag,
  PackageOpen,
  ChevronDown,
  ChevronUp,
  Upload,
  Calendar,
  Scale,
  Droplets,
  Apple,
  Beef,
  Pill,
  Utensils,
  ShoppingCart
} from 'lucide-react';
import { db, storage, auth } from '../../firebase/firebase.config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  onSnapshot 
} from 'firebase/firestore';
import { 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Vendor information from hotels collection
  const [vendorInfo, setVendorInfo] = useState(null);
  
  // Products state
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalSales: 0
  });
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    availability: 'all',
    sortBy: 'name',
    viewMode: 'grid'
  });
  
  // Category-specific filters
  const [categoryFilters, setCategoryFilters] = useState({
    // Food
    isVeg: 'all',
    spiceLevel: 'all',
    cuisine: 'all',
    bestseller: false,
    
    // Medicine
    medicineType: 'all',
    prescriptionRequired: 'all',
    
    // Grocery
    productType: 'all',
    organic: false,
    
    // Fruits & Vegetables
    fruitType: 'all',
    organicFruits: false,
    seasonal: false,
    
    // Meat & Fish
    meatType: 'all',
    cutType: 'all',
    freshFrozen: 'all',
    
    // Dress & Gadgets
    gender: 'all',
    occasion: 'all',
    size: 'all'
  });
  
  // Add/Edit Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    imageFile: null,
    availability: true,
    quantity: 1,
    isVeg: true,
    
    // Food specific
    spiceLevel: 'mild',
    cuisine: '',
    ingredients: '',
    calories: '',
    preparationTime: '',
    packagingType: '',
    bestseller: false,
    
    // Medicine specific
    medicineType: '',
    expiryDate: '',
    batchNumber: '',
    prescriptionRequired: false,
    saltComposition: '',
    dosageInstructions: '',
    manufacturer: '',
    storageConditions: '',
    sideEffects: '',
    
    // Grocery specific
    groceryType: '',
    netWeight: '',
    weightUnit: 'g',
    manufacturerGrocery: '',
    storageInstructions: '',
    countryOfOrigin: '',
    
    // Fruits & Vegetables specific
    fruitVegetableType: '',
    weightFruits: '',
    weightUnitFruits: 'g',
    organicFruit: false,
    freshnessDuration: '',
    cutOption: 'uncut',
    seasonalFruit: false,
    storageInstructionsFruits: '',
    
    // Meat & Fish specific
    meatFishType: '',
    cutType: '',
    weightMeat: '',
    weightUnitMeat: 'g',
    freshFrozen: 'fresh',
    source: '',
    packagingTypeMeat: '',
    deliverySlot: '',
    storageInstructionsMeat: '',
    
    // Dress & Gadgets specific
    gender: 'unisex',
    size: '',
    colorOptions: '',
    fabricMaterial: '',
    fitType: '',
    occasionDress: '',
    washCareInstructions: '',
    countryOfManufacture: '',
    
    // Common meta
    createdAt: null,
    updatedAt: null,
    vendorId: '',
    businessId: '',
    categoryId: '',
    status: 'active'
  });
  
  // Check for stored vendor session on mount
  useEffect(() => {
    const checkVendorSession = async () => {
      try {
        // Check session storage first, then local storage
        let sessionData = sessionStorage.getItem('vendorSession');
        if (!sessionData) {
          sessionData = localStorage.getItem('vendorSession');
        }
        
        if (sessionData) {
          const parsedSession = JSON.parse(sessionData);
          await fetchVendorInfo(parsedSession.applicationId);
        } else {
          // If no session, redirect to login
          navigate('/');
        }
      } catch (error) {
        console.error('Session check error:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    checkVendorSession();
  }, [navigate]);
  
  // Fetch vendor info from hotels collection using applicationId
  const fetchVendorInfo = async (applicationId) => {
    try {
      setLoading(true);
      const hotelsRef = collection(db, 'hotels');
      const q = query(hotelsRef, where('applicationId', '==', applicationId.trim()));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const vendorDoc = querySnapshot.docs[0];
        const vendorData = vendorDoc.data();
        
        // Check if vendor is approved
        if (vendorData.status !== 'approved') {
          toast.error('Your application is pending approval');
          sessionStorage.removeItem('vendorSession');
          localStorage.removeItem('vendorSession');
          navigate('/');
          return;
        }
        
        setVendorInfo({
          id: vendorDoc.id,
          businessName: vendorData.hotelName,
          businessId: vendorDoc.id,
          categoryId: vendorData.categoryId,
          categoryName: vendorData.categoryName,
          applicationId: vendorData.applicationId,
          email: vendorData.email,
          phone: vendorData.phone,
          address: vendorData.address,
          status: vendorData.status
        });
        
        // Start listening to vendor's products
        setupProductsListener(vendorDoc.id, vendorData.applicationId);
      } else {
        toast.error('Vendor information not found');
        sessionStorage.removeItem('vendorSession');
        localStorage.removeItem('vendorSession');
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching vendor info:', error);
      toast.error('Failed to load vendor information');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };
  
  // Setup real-time listener for vendor's products
  const setupProductsListener = (vendorId, applicationId) => {
    const productsRef = collection(db, 'menu');
    const q = query(
      productsRef, 
      where('vendorId', '==', vendorId),
      where('applicationId', '==', applicationId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = [];
      snapshot.forEach((doc) => {
        productsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setProducts(productsData);
      updateStats(productsData);
    }, (error) => {
      console.error('Error in products listener:', error);
      toast.error('Error loading products');
    });
    
    return unsubscribe;
  };
  
  const updateStats = (productsList) => {
    const totalProducts = productsList.length;
    const activeProducts = productsList.filter(p => p.availability === true).length;
    const outOfStock = productsList.filter(p => p.availability === false).length;
    
    setStats({
      totalProducts,
      activeProducts,
      outOfStock,
      totalSales: 0 // This would come from orders data
    });
  };
  
  // Apply filters whenever products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, filters, categoryFilters]);
  
  const applyFilters = () => {
    let filtered = [...products];
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
      );
    }
    
    // Availability filter
    if (filters.availability === 'active') {
      filtered = filtered.filter(product => product.availability === true);
    } else if (filters.availability === 'outOfStock') {
      filtered = filtered.filter(product => product.availability === false);
    }
    
    // Category-specific filters based on vendor's category
    if (vendorInfo) {
      switch (vendorInfo.categoryName) {
        case 'Food':
          if (categoryFilters.isVeg !== 'all') {
            const isVeg = categoryFilters.isVeg === 'veg';
            filtered = filtered.filter(product => product.isVeg === isVeg);
          }
          if (categoryFilters.spiceLevel !== 'all') {
            filtered = filtered.filter(product => product.spiceLevel === categoryFilters.spiceLevel);
          }
          if (categoryFilters.cuisine !== 'all') {
            filtered = filtered.filter(product => product.cuisine === categoryFilters.cuisine);
          }
          if (categoryFilters.bestseller) {
            filtered = filtered.filter(product => product.bestseller === true);
          }
          break;
          
        case 'Medicine':
          if (categoryFilters.medicineType !== 'all') {
            filtered = filtered.filter(product => product.medicineType === categoryFilters.medicineType);
          }
          if (categoryFilters.prescriptionRequired !== 'all') {
            const prescriptionRequired = categoryFilters.prescriptionRequired === 'yes';
            filtered = filtered.filter(product => product.prescriptionRequired === prescriptionRequired);
          }
          break;
          
        case 'Groceries':
          if (categoryFilters.productType !== 'all') {
            filtered = filtered.filter(product => product.groceryType === categoryFilters.productType);
          }
          if (categoryFilters.organic) {
            filtered = filtered.filter(product => product.organic === true);
          }
          break;
          
        case 'Fruits & Vegetables':
          if (categoryFilters.fruitType !== 'all') {
            filtered = filtered.filter(product => product.fruitVegetableType === categoryFilters.fruitType);
          }
          if (categoryFilters.organicFruits) {
            filtered = filtered.filter(product => product.organic === true);
          }
          if (categoryFilters.seasonal) {
            filtered = filtered.filter(product => product.seasonal === true);
          }
          break;
          
        case 'Meat & Fish':
          if (categoryFilters.meatType !== 'all') {
            filtered = filtered.filter(product => product.meatFishType === categoryFilters.meatType);
          }
          if (categoryFilters.cutType !== 'all') {
            filtered = filtered.filter(product => product.cutType === categoryFilters.cutType);
          }
          if (categoryFilters.freshFrozen !== 'all') {
            filtered = filtered.filter(product => product.freshFrozen === categoryFilters.freshFrozen);
          }
          break;
          
        case 'Dress & Gadgets':
          if (categoryFilters.gender !== 'all') {
            filtered = filtered.filter(product => product.gender === categoryFilters.gender);
          }
          if (categoryFilters.occasion !== 'all') {
            filtered = filtered.filter(product => product.occasion === categoryFilters.occasion);
          }
          if (categoryFilters.size !== 'all') {
            filtered = filtered.filter(product => product.size === categoryFilters.size);
          }
          break;
      }
    }
    
    // Sort filter
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'priceLow':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt));
        break;
      case 'bestseller':
        filtered.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
    }
    
    setFilteredProducts(filtered);
  };
  
  const handleLogout = async () => {
    try {
      // Clear session data
      sessionStorage.removeItem('vendorSession');
      localStorage.removeItem('vendorSession');
      
      // Navigate to login
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };
  
  const uploadImageToFirebase = async (file) => {
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const timestamp = Date.now();
      const fileName = `product_images/${vendorInfo.applicationId}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      clearInterval(interval);
      setUploadProgress(100);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };
  
  const handleAddProduct = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!newProduct.name.trim() || !newProduct.price || newProduct.price <= 0) {
        toast.error('Product name and price are required');
        return;
      }
      
      // Upload image if file is selected
      let imageUrl = newProduct.image;
      if (newProduct.imageFile) {
        toast.info('Uploading product image...');
        imageUrl = await uploadImageToFirebase(newProduct.imageFile);
        if (!imageUrl) {
          toast.error('Failed to upload image');
          return;
        }
      }
      
      // Prepare product data based on category
      const productData = {
        // Common fields
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        image: imageUrl,
        availability: newProduct.availability,
        quantity: parseInt(newProduct.quantity) || 1,
        isVeg: newProduct.isVeg,
        
        // Vendor info
        vendorId: vendorInfo.id,
        businessId: vendorInfo.businessId,
        applicationId: vendorInfo.applicationId,
        categoryId: vendorInfo.categoryId,
        categoryName: vendorInfo.categoryName,
        businessName: vendorInfo.businessName,
        
        // Status
        status: 'active',
        
        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      // Add category-specific fields
      switch (vendorInfo.categoryName) {
        case 'Food':
          productData.spiceLevel = newProduct.spiceLevel;
          productData.cuisine = newProduct.cuisine;
          productData.ingredients = newProduct.ingredients;
          productData.calories = newProduct.calories;
          productData.preparationTime = newProduct.preparationTime;
          productData.packagingType = newProduct.packagingType;
          productData.bestseller = newProduct.bestseller;
          break;
          
        case 'Medicine':
          productData.medicineType = newProduct.medicineType;
          productData.expiryDate = newProduct.expiryDate;
          productData.batchNumber = newProduct.batchNumber;
          productData.prescriptionRequired = newProduct.prescriptionRequired;
          productData.saltComposition = newProduct.saltComposition;
          productData.dosageInstructions = newProduct.dosageInstructions;
          productData.manufacturer = newProduct.manufacturer;
          productData.storageConditions = newProduct.storageConditions;
          productData.sideEffects = newProduct.sideEffects;
          
          // Auto-disable if expired
          if (newProduct.expiryDate) {
            const expiryDate = new Date(newProduct.expiryDate);
            const today = new Date();
            if (expiryDate < today) {
              productData.availability = false;
              productData.status = 'expired';
            }
          }
          break;
          
        case 'Groceries':
          productData.groceryType = newProduct.groceryType;
          productData.netWeight = newProduct.netWeight;
          productData.weightUnit = newProduct.weightUnit;
          productData.manufacturer = newProduct.manufacturerGrocery;
          productData.storageInstructions = newProduct.storageInstructions;
          productData.countryOfOrigin = newProduct.countryOfOrigin;
          productData.organic = newProduct.organic;
          break;
          
        case 'Fruits & Vegetables':
          productData.fruitVegetableType = newProduct.fruitVegetableType;
          productData.weight = newProduct.weightFruits;
          productData.weightUnit = newProduct.weightUnitFruits;
          productData.organic = newProduct.organicFruit;
          productData.freshnessDuration = newProduct.freshnessDuration;
          productData.cutOption = newProduct.cutOption;
          productData.seasonal = newProduct.seasonalFruit;
          productData.storageInstructions = newProduct.storageInstructionsFruits;
          break;
          
        case 'Meat & Fish':
          productData.meatFishType = newProduct.meatFishType;
          productData.cutType = newProduct.cutType;
          productData.weight = newProduct.weightMeat;
          productData.weightUnit = newProduct.weightUnitMeat;
          productData.freshFrozen = newProduct.freshFrozen;
          productData.source = newProduct.source;
          productData.packagingType = newProduct.packagingTypeMeat;
          productData.deliverySlot = newProduct.deliverySlot;
          productData.storageInstructions = newProduct.storageInstructionsMeat;
          break;
          
        case 'Dress & Gadgets':
          productData.gender = newProduct.gender;
          productData.size = newProduct.size;
          productData.colorOptions = newProduct.colorOptions;
          productData.fabricMaterial = newProduct.fabricMaterial;
          productData.fitType = newProduct.fitType;
          productData.occasion = newProduct.occasionDress;
          productData.washCareInstructions = newProduct.washCareInstructions;
          productData.countryOfManufacture = newProduct.countryOfManufacture;
          break;
      }
      
      if (editingProduct) {
        // Update existing product
        productData.updatedAt = serverTimestamp();
        await updateDoc(doc(db, 'menu', editingProduct.id), productData);
        toast.success('Product updated successfully!');
      } else {
        // Add new product - save to menu collection
        await addDoc(collection(db, 'menu'), productData);
        toast.success('Product added successfully!');
      }
      
      // Reset form and close modal
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      image: product.image || '',
      imageFile: null,
      availability: product.availability !== false,
      quantity: product.quantity || 1,
      isVeg: product.isVeg !== false,
      
      // Food specific
      spiceLevel: product.spiceLevel || 'mild',
      cuisine: product.cuisine || '',
      ingredients: product.ingredients || '',
      calories: product.calories || '',
      preparationTime: product.preparationTime || '',
      packagingType: product.packagingType || '',
      bestseller: product.bestseller || false,
      
      // Medicine specific
      medicineType: product.medicineType || '',
      expiryDate: product.expiryDate || '',
      batchNumber: product.batchNumber || '',
      prescriptionRequired: product.prescriptionRequired || false,
      saltComposition: product.saltComposition || '',
      dosageInstructions: product.dosageInstructions || '',
      manufacturer: product.manufacturer || '',
      storageConditions: product.storageConditions || '',
      sideEffects: product.sideEffects || '',
      
      // Grocery specific
      groceryType: product.groceryType || '',
      netWeight: product.netWeight || '',
      weightUnit: product.weightUnit || 'g',
      manufacturerGrocery: product.manufacturer || '',
      storageInstructions: product.storageInstructions || '',
      countryOfOrigin: product.countryOfOrigin || '',
      organic: product.organic || false,
      
      // Fruits & Vegetables specific
      fruitVegetableType: product.fruitVegetableType || '',
      weightFruits: product.weight || '',
      weightUnitFruits: product.weightUnit || 'g',
      organicFruit: product.organic || false,
      freshnessDuration: product.freshnessDuration || '',
      cutOption: product.cutOption || 'uncut',
      seasonalFruit: product.seasonal || false,
      storageInstructionsFruits: product.storageInstructions || '',
      
      // Meat & Fish specific
      meatFishType: product.meatFishType || '',
      cutType: product.cutType || '',
      weightMeat: product.weight || '',
      weightUnitMeat: product.weightUnit || 'g',
      freshFrozen: product.freshFrozen || 'fresh',
      source: product.source || '',
      packagingTypeMeat: product.packagingType || '',
      deliverySlot: product.deliverySlot || '',
      storageInstructionsMeat: product.storageInstructions || '',
      
      // Dress & Gadgets specific
      gender: product.gender || 'unisex',
      size: product.size || '',
      colorOptions: product.colorOptions || '',
      fabricMaterial: product.fabricMaterial || '',
      fitType: product.fitType || '',
      occasionDress: product.occasion || '',
      washCareInstructions: product.washCareInstructions || '',
      countryOfManufacture: product.countryOfManufacture || '',
    });
    setShowProductModal(true);
  };
  
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await deleteDoc(doc(db, 'menu', productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };
  
  const handleToggleAvailability = async (productId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'menu', productId), {
        availability: !currentStatus,
        updatedAt: serverTimestamp()
      });
      toast.success(`Product ${!currentStatus ? 'activated' : 'deactivated'}!`);
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };
  
  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      image: '',
      imageFile: null,
      availability: true,
      quantity: 1,
      isVeg: true,
      spiceLevel: 'mild',
      cuisine: '',
      ingredients: '',
      calories: '',
      preparationTime: '',
      packagingType: '',
      bestseller: false,
      medicineType: '',
      expiryDate: '',
      batchNumber: '',
      prescriptionRequired: false,
      saltComposition: '',
      dosageInstructions: '',
      manufacturer: '',
      storageConditions: '',
      sideEffects: '',
      groceryType: '',
      netWeight: '',
      weightUnit: 'g',
      manufacturerGrocery: '',
      storageInstructions: '',
      countryOfOrigin: '',
      fruitVegetableType: '',
      weightFruits: '',
      weightUnitFruits: 'g',
      organicFruit: false,
      freshnessDuration: '',
      cutOption: 'uncut',
      seasonalFruit: false,
      storageInstructionsFruits: '',
      meatFishType: '',
      cutType: '',
      weightMeat: '',
      weightUnitMeat: 'g',
      freshFrozen: 'fresh',
      source: '',
      packagingTypeMeat: '',
      deliverySlot: '',
      storageInstructionsMeat: '',
      gender: 'unisex',
      size: '',
      colorOptions: '',
      fabricMaterial: '',
      fitType: '',
      occasionDress: '',
      washCareInstructions: '',
      countryOfManufacture: '',
    });
  };
  
  const renderCategorySpecificFields = () => {
    if (!vendorInfo) return null;
    
    switch (vendorInfo.categoryName) {
      case 'Food':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Food Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isVeg"
                      checked={newProduct.isVeg === true}
                      onChange={(e) => setNewProduct({...newProduct, isVeg: true})}
                      className="mr-2"
                    />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isVeg"
                      checked={newProduct.isVeg === false}
                      onChange={(e) => setNewProduct({...newProduct, isVeg: false})}
                      className="mr-2"
                    />
                    <span className="text-sm">Non-Vegetarian</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Spice Level</label>
                <select
                  value={newProduct.spiceLevel}
                  onChange={(e) => setNewProduct({...newProduct, spiceLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="mild">Mild</option>
                  <option value="medium">Medium</option>
                  <option value="spicy">Spicy</option>
                  <option value="very-spicy">Very Spicy</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
                <input
                  type="text"
                  value={newProduct.cuisine}
                  onChange={(e) => setNewProduct({...newProduct, cuisine: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., South Indian, Chinese"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time</label>
                <input
                  type="text"
                  value={newProduct.preparationTime}
                  onChange={(e) => setNewProduct({...newProduct, preparationTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., 15-20 min"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
              <textarea
                value={newProduct.ingredients}
                onChange={(e) => setNewProduct({...newProduct, ingredients: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="2"
                placeholder="List main ingredients"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input
                  type="text"
                  value={newProduct.calories}
                  onChange={(e) => setNewProduct({...newProduct, calories: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., 250 kcal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Type</label>
                <input
                  type="text"
                  value={newProduct.packagingType}
                  onChange={(e) => setNewProduct({...newProduct, packagingType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Biodegradable"
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={newProduct.bestseller}
                  onChange={(e) => setNewProduct({...newProduct, bestseller: e.target.checked})}
                  className="w-4 h-4 text-yellow-600"
                />
                <label className="text-sm font-medium text-gray-700">Mark as Bestseller</label>
              </div>
            </div>
          </div>
        );
        
      case 'Medicine':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Medicine Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Type</label>
                <select
                  value={newProduct.medicineType}
                  onChange={(e) => setNewProduct({...newProduct, medicineType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="syrup">Syrup</option>
                  <option value="injection">Injection</option>
                  <option value="ointment">Ointment</option>
                  <option value="drops">Drops</option>
                  <option value="inhaler">Inhaler</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                <input
                  type="date"
                  value={newProduct.expiryDate}
                  onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  value={newProduct.batchNumber}
                  onChange={(e) => setNewProduct({...newProduct, batchNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Batch number"
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={newProduct.prescriptionRequired}
                  onChange={(e) => setNewProduct({...newProduct, prescriptionRequired: e.target.checked})}
                  className="w-4 h-4 text-red-600"
                />
                <label className="text-sm font-medium text-gray-700">Prescription Required</label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salt Composition</label>
              <input
                type="text"
                value={newProduct.saltComposition}
                onChange={(e) => setNewProduct({...newProduct, saltComposition: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="e.g., Paracetamol 500mg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Instructions</label>
              <textarea
                value={newProduct.dosageInstructions}
                onChange={(e) => setNewProduct({...newProduct, dosageInstructions: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="2"
                placeholder="e.g., Take 1 tablet twice daily after meals"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={newProduct.manufacturer}
                  onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Manufacturer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
                <input
                  type="text"
                  value={newProduct.storageConditions}
                  onChange={(e) => setNewProduct({...newProduct, storageConditions: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Store in cool dry place"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Side Effects (Optional)</label>
              <textarea
                value={newProduct.sideEffects}
                onChange={(e) => setNewProduct({...newProduct, sideEffects: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="2"
                placeholder="List possible side effects"
              />
            </div>
          </div>
        );
        
      case 'Groceries':
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Grocery Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label>
                <select
                  value={newProduct.groceryType}
                  onChange={(e) => setNewProduct({...newProduct, groceryType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="staples">Staples</option>
                  <option value="snacks">Snacks</option>
                  <option value="beverages">Beverages</option>
                  <option value="dairy">Dairy</option>
                  <option value="frozen">Frozen Foods</option>
                  <option value="personal-care">Personal Care</option>
                  <option value="cleaning">Cleaning Supplies</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Net Weight/Volume</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProduct.netWeight}
                    onChange={(e) => setNewProduct({...newProduct, netWeight: e.target.value})}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., 500"
                  />
                  <select
                    value={newProduct.weightUnit}
                    onChange={(e) => setNewProduct({...newProduct, weightUnit: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="piece">piece</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={newProduct.manufacturerGrocery}
                  onChange={(e) => setNewProduct({...newProduct, manufacturerGrocery: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Manufacturer name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={newProduct.countryOfOrigin}
                  onChange={(e) => setNewProduct({...newProduct, countryOfOrigin: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., India"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
              <textarea
                value={newProduct.storageInstructions}
                onChange={(e) => setNewProduct({...newProduct, storageInstructions: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="2"
                placeholder="Storage instructions"
              />
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={newProduct.organic}
                onChange={(e) => setNewProduct({...newProduct, organic: e.target.checked})}
                className="w-4 h-4 text-green-600"
              />
              <label className="text-sm font-medium text-gray-700">Organic Product</label>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">{vendorInfo.categoryName} Details</h3>
            <p className="text-sm text-gray-500">Add product details specific to your category</p>
          </div>
        );
    }
  };
  
  const renderCategoryFilters = () => {
    if (!vendorInfo) return null;
    
    switch (vendorInfo.categoryName) {
      case 'Food':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
              <select
                value={categoryFilters.isVeg}
                onChange={(e) => setCategoryFilters({...categoryFilters, isVeg: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Spice Level</label>
              <select
                value={categoryFilters.spiceLevel}
                onChange={(e) => setCategoryFilters({...categoryFilters, spiceLevel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Levels</option>
                <option value="mild">Mild</option>
                <option value="medium">Medium</option>
                <option value="spicy">Spicy</option>
                <option value="very-spicy">Very Spicy</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine</label>
              <select
                value={categoryFilters.cuisine}
                onChange={(e) => setCategoryFilters({...categoryFilters, cuisine: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Cuisines</option>
                <option value="south-indian">South Indian</option>
                <option value="north-indian">North Indian</option>
                <option value="chinese">Chinese</option>
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={categoryFilters.bestseller}
                onChange={(e) => setCategoryFilters({...categoryFilters, bestseller: e.target.checked})}
                className="w-4 h-4 text-yellow-600"
              />
              <label className="text-sm font-medium text-gray-700">Bestseller Only</label>
            </div>
          </div>
        );
        
      case 'Medicine':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Type</label>
              <select
                value={categoryFilters.medicineType}
                onChange={(e) => setCategoryFilters({...categoryFilters, medicineType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="tablet">Tablet</option>
                <option value="capsule">Capsule</option>
                <option value="syrup">Syrup</option>
                <option value="injection">Injection</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Required</label>
              <select
                value={categoryFilters.prescriptionRequired}
                onChange={(e) => setCategoryFilters({...categoryFilters, prescriptionRequired: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All</option>
                <option value="yes">Prescription Required</option>
                <option value="no">OTC (No Prescription)</option>
              </select>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-sm text-gray-500 text-center py-4">
            No category-specific filters available for {vendorInfo.categoryName}
          </div>
        );
    }
  };

  // Render Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Product Modal
  const renderProductModal = () => {
    if (!showProductModal) return null;

    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => {
                  setShowProductModal(false);
                  setEditingProduct(null);
                  resetProductForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows="3"
                    placeholder="Product description"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={newProduct.availability}
                      onChange={(e) => setNewProduct({...newProduct, availability: e.target.checked})}
                      className="w-4 h-4 text-green-600"
                    />
                    <label className="text-sm font-medium text-gray-700">Available for Sale</label>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Product Image</h3>
                
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${uploading ? 'opacity-50' : ''}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (!file.type.match('image.*')) {
                          toast.error('Please select an image file');
                          return;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error('File size should be less than 2MB');
                          return;
                        }
                        setNewProduct({...newProduct, imageFile: file, image: ''});
                      }
                    }}
                    className="hidden"
                    id="productImageUpload"
                    disabled={uploading}
                  />
                  <label htmlFor="productImageUpload" className={`cursor-pointer block ${uploading ? 'cursor-not-allowed' : ''}`}>
                    {uploading ? (
                      <>
                        <div className="w-12 h-12 mx-auto mb-3 relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">Click to upload product image</p>
                        <p className="text-xs text-gray-500 mt-1">JPEG, PNG up to 2MB</p>
                      </>
                    )}
                  </label>
                  
                  {newProduct.imageFile && !uploading && (
                    <div className="mt-4">
                      <p className="text-sm text-green-600">
                        Selected: {newProduct.imageFile.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => setNewProduct({...newProduct, imageFile: null})}
                        className="text-sm text-red-600 hover:text-red-800 mt-2"
                      >
                        Remove image
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({...newProduct, image: e.target.value, imageFile: null})}
                    disabled={!!newProduct.imageFile || uploading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="https://example.com/product-image.jpg"
                  />
                </div>
              </div>

              {/* Category Specific Fields */}
              {renderCategorySpecificFields()}

              {/* Submit Button */}
              <div className="pt-4 border-t">
                <button
                  onClick={handleAddProduct}
                  disabled={loading || uploading || !newProduct.name || !newProduct.price}
                  className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-gray-800">VENDOR PANEL</h1>
                <p className="text-xs text-gray-500">{vendorInfo?.businessName}</p>
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
            { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
            { id: 'products', label: 'Product List', icon: <Package className="w-5 h-5" /> },
            { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
            { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
            { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 my-1 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
            </button>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 text-red-600 hover:bg-red-50 rounded-lg`}
            >
              <LogOut className="w-5 h-5" />
              {sidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 capitalize">
                {activeTab === 'products' ? 'Product Management' : 
                 activeTab === 'orders' ? 'Order Management' :
                 activeTab === 'analytics' ? 'Analytics' :
                 activeTab === 'settings' ? 'Settings' : 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">
                {vendorInfo?.categoryName} • {vendorInfo?.businessName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowProductModal(true)}
                className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
              <div className="text-sm text-gray-600">
                Application ID: <span className="font-semibold">{vendorInfo?.applicationId}</span>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <span className="text-yellow-700 font-semibold">V</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && vendorInfo && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <Package className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-green-600">+{stats.activeProducts} active</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">{stats.totalProducts}</h3>
                  <p className="text-sm text-gray-500">Total Products</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-green-600">Active</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">{stats.activeProducts}</h3>
                  <p className="text-sm text-gray-500">Active Products</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <X className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-red-600">Out of stock</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">{stats.outOfStock}</h3>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-green-600">+12%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-4">₹{stats.totalSales}</h3>
                  <p className="text-sm text-gray-500">Total Sales</p>
                </div>
              </div>

              {/* Recent Products */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Recent Products</h3>
                    <p className="text-sm text-gray-500">Recently added products</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('products')}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    View All
                  </button>
                </div>
                
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Loading products...</p>
                    </div>
                  ) : products.slice(0, 5).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{product.name}</h4>
                          <p className="text-sm text-gray-500">₹{product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {product.availability ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {product.bestseller && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Bestseller
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {products.length === 0 && !loading && (
                    <div className="text-center py-8 text-gray-500">
                      No products yet. Add your first product!
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* PRODUCT MANAGEMENT */}
          {activeTab === 'products' && vendorInfo && (
            <div className="space-y-6">
              {/* Product Stats and Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Product List</h3>
                      <p className="text-sm text-gray-500">Manage your products inventory</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setFilters({...filters, viewMode: filters.viewMode === 'grid' ? 'list' : 'grid'})}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        {filters.viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => setShowProductModal(true)}
                        className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Product
                      </button>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center space-x-4 mb-6 flex-wrap gap-2">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        value={filters.search}
                        onChange={(e) => setFilters({...filters, search: e.target.value})}
                      />
                    </div>
                    
                    <select 
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      value={filters.availability}
                      onChange={(e) => setFilters({...filters, availability: e.target.value})}
                    >
                      <option value="all">All Products</option>
                      <option value="active">In Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                    </select>
                    
                    <select 
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    >
                      <option value="name">Sort by Name</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="bestseller">Bestseller First</option>
                    </select>
                  </div>
                  
                  {/* Category Specific Filters */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Category Filters</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      {renderCategoryFilters()}
                    </div>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Products</span>
                      <span className="font-semibold">{stats.totalProducts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Products</span>
                      <span className="font-semibold text-green-600">{stats.activeProducts}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Out of Stock</span>
                      <span className="font-semibold text-red-600">{stats.outOfStock}</span>
                    </div>
                    <div className="pt-4 border-t">
                      <button 
                        onClick={() => {
                          setFilters({
                            search: '',
                            availability: 'all',
                            sortBy: 'name',
                            viewMode: 'grid'
                          });
                          setCategoryFilters({
                            isVeg: 'all',
                            spiceLevel: 'all',
                            cuisine: 'all',
                            bestseller: false,
                            medicineType: 'all',
                            prescriptionRequired: 'all',
                            productType: 'all',
                            organic: false,
                            fruitType: 'all',
                            organicFruits: false,
                            seasonal: false,
                            meatType: 'all',
                            cutType: 'all',
                            freshFrozen: 'all',
                            gender: 'all',
                            occasion: 'all',
                            size: 'all'
                          });
                        }}
                        className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Showing {filteredProducts.length} of {products.length} products
                    </p>
                    <p className="text-sm text-gray-600">
                      {vendorInfo.categoryName} • {vendorInfo.businessName}
                    </p>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading products...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Package className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      {products.length === 0 ? 'Add your first product to get started!' : 'Try changing your filters'}
                    </p>
                    {products.length === 0 && (
                      <button 
                        onClick={() => setShowProductModal(true)}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                      >
                        Add Your First Product
                      </button>
                    )}
                  </div>
                ) : filters.viewMode === 'grid' ? (
                  // Grid View
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        {/* Product Image */}
                        <div className="h-48 bg-gray-100 overflow-hidden relative">
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                          {!product.availability && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full text-sm">
                                Out of Stock
                              </span>
                            </div>
                          )}
                          {/* Product badges */}
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {product.bestseller && (
                              <span className="px-2 py-1 text-xs bg-yellow-500 text-white rounded-full">
                                Bestseller
                              </span>
                            )}
                            {product.isVeg === false && (
                              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                Non-Veg
                              </span>
                            )}
                            {product.isVeg === true && vendorInfo.categoryName === 'Food' && (
                              <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                                Veg
                              </span>
                            )}
                            {product.organic && (
                              <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full">
                                Organic
                              </span>
                            )}
                            {product.prescriptionRequired && (
                              <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                                Prescription
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Product Info */}
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2 h-10">
                            {product.description || 'No description'}
                          </p>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                              {product.quantity && (
                                <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                              )}
                            </div>
                            
                            {/* Category-specific info */}
                            {vendorInfo.categoryName === 'Food' && product.spiceLevel && (
                              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                {product.spiceLevel}
                              </span>
                            )}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-4 flex items-center space-x-2">
                            <button
                              onClick={() => handleToggleAvailability(product.id, product.availability)}
                              className={`flex-1 py-2 text-sm rounded-lg ${
                                product.availability 
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                            >
                              {product.availability ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                                  {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">{product.name}</h4>
                                  <p className="text-sm text-gray-500 truncate max-w-xs">
                                    {product.description || 'No description'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                {vendorInfo.categoryName === 'Food' && (
                                  <>
                                    {product.cuisine && (
                                      <span className="text-xs text-gray-600">Cuisine: {product.cuisine}</span>
                                    )}
                                    {product.spiceLevel && (
                                      <span className="text-xs text-gray-600">Spice: {product.spiceLevel}</span>
                                    )}
                                  </>
                                )}
                                {vendorInfo.categoryName === 'Medicine' && product.medicineType && (
                                  <span className="text-xs text-gray-600">Type: {product.medicineType}</span>
                                )}
                                {product.quantity && (
                                  <span className="text-xs text-gray-600">Qty: {product.quantity}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-semibold text-gray-800">₹{product.price}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-1">
                                <span className={`px-2 py-1 text-xs rounded-full w-fit ${
                                  product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {product.availability ? 'In Stock' : 'Out of Stock'}
                                </span>
                                {product.bestseller && (
                                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full w-fit">
                                    Bestseller
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleAvailability(product.id, product.availability)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title={product.availability ? 'Deactivate' : 'Activate'}
                                >
                                  {product.availability ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* OTHER TABS */}
          {['orders', 'analytics', 'settings'].includes(activeTab) && vendorInfo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-3xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This section is under development</p>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {renderProductModal()}
    </div>
  );
};

export default VendorDashboard;