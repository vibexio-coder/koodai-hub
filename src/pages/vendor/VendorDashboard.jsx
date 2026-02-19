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
  onSnapshot,
  collectionGroup,
  getDoc
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
  const [orders, setOrders] = useState([]);
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

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All Status');

  // Add/Edit Product Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    // Basic Fields
    name: '',
    description: '',
    price: '',
    image: '',
    inStock: true,
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
    medicineType: 'tablet',
    expiryDate: '',
    batchNumber: '',
    prescriptionRequired: false,
    saltComposition: '',
    dosageInstructions: '',
    manufacturer: '',
    storageConditions: '',
    sideEffects: '',

    // Grocery specific
    groceryType: 'staples',
    netWeight: '',
    weightUnit: 'g',
    manufacturerGrocery: '',
    storageInstructions: '',
    countryOfOrigin: '',

    // Fruits & Vegetables specific
    fruitVegetableType: 'fruits',
    weightFruits: '',
    weightUnitFruits: 'g',
    organicFruit: false,
    freshnessDuration: '',
    cutOption: 'uncut',
    seasonalFruit: false,
    storageInstructionsFruits: '',

    // Meat & Fish specific
    meatFishType: 'chicken',
    cutType: 'curry-cut',
    weightMeat: '',
    weightUnitMeat: 'g',
    freshFrozen: 'fresh',
    source: '',
    packagingTypeMeat: '',
    deliverySlot: 'morning',
    storageInstructionsMeat: '',

    // Dress & Gadgets specific
    gender: 'unisex',
    size: '',
    colorOptions: '',
    fabricMaterial: '',
    fitType: 'regular',
    occasionDress: '',
    washCareInstructions: '',
    countryOfManufacture: '',
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
          businessName: vendorData.name || vendorData.hotelName,
          businessId: vendorDoc.id,
          categoryId: vendorData.categoryId,
          categoryName: vendorData.categoryName,
          applicationId: vendorData.applicationId,
          email: vendorData.email,
          phone: vendorData.phone,
          address: vendorData.address,
          status: vendorData.status,
          open: vendorData.open || false,
          openingTime: vendorData.openingTime || '',
          closingTime: vendorData.closingTime || '',
          uid: vendorData.uid || vendorData.ownerId // Capture vendorUID for orders query
        });

        // Start listening to vendor's products
        setupProductsListener(vendorDoc.id, vendorData.applicationId);
        setupOrdersListener(vendorData.applicationId); // Pass Application ID as requested
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
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('hotelId', '==', vendorId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        productsData.push({
          id: doc.id,
          ...data,
          name: data.productName || data.name,
          description: data.productDescription || data.description,
          quantity: data.stockQuantity || data.quantity || 1,
          image: data.productImage || data.image,
          inStock: data.inStock !== false, // Default to true if missing
          availability: data.status === 'active' || data.availability === true,
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

  // Setup real-time listener for vendor's orders
  const setupOrdersListener = (vendorUID) => {
    if (!vendorUID) {
      console.error('VendorDashboard: No vendorUID provided for orders listener');
      return () => { };
    }

    // collectionGroup query to find all storeOrders for this vendor where status is Pending
    const q = query(
      collectionGroup(db, 'storeOrders'),
      where('storeOwnerId', '==', vendorUID)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('VendorDashboard: Orders snapshot received');
      console.log('VendorDashboard: storeOwnerId used for query:', vendorUID);
      console.log('VendorDashboard: Snapshot size:', snapshot.size);

      if (snapshot.empty) {
        console.log('VendorDashboard: No Pending storeOrders found for this vendor.');
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const ordersPromises = snapshot.docs.map(async (storeOrderDoc) => {
          const storeOrderData = storeOrderDoc.data();
          console.log(`Processing storeOrder: ${storeOrderDoc.id}`, storeOrderData);

          // The parent of storeOrders/{storeId} is the order document
          // path: orders/{orderId}/storeOrders/{storeId}
          const orderRef = storeOrderDoc.ref.parent.parent;

          if (!orderRef) {
            console.error(`StoreOrder ${storeOrderDoc.id} has no parent order (orphan?). Path: ${storeOrderDoc.ref.path}`);
            return null;
          }

          const orderSnap = await getDoc(orderRef);
          if (!orderSnap.exists()) {
            console.error(`Parent order not found for storeOrder ${storeOrderDoc.id}. ParentID: ${orderRef.id}`);
            return null;
          }

          const orderData = orderSnap.data();
          // console.log(`Parent order found: ${orderRef.id}`, orderData); // Reduced logging

          // Fetch products subcollection for this store order
          // path: orders/{orderId}/storeOrders/{storeId}/products
          const productsSnapshot = await getDocs(collection(storeOrderDoc.ref, 'products'));
          const productsData = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          // Combine parent order data with store-specific data
          return {
            id: orderRef.id, // Main Order ID
            ...orderData, // Customer info, delivery address etc
            // Store specific details overrides
            totalAmount: storeOrderData.storeTotal || 0,
            status: storeOrderData.storeStatus || 'Pending', // Should be 'Pending' based on query
            items: productsData,
            storeOrderId: storeOrderDoc.id,
            storeDocId: storeOrderDoc.id // Alias for clarity
          };
        });

        const ordersData = (await Promise.all(ordersPromises)).filter(order => order !== null);

        // Client-side sort by creation time
        ordersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });

        setOrders(ordersData);

        // Calculate total sales - Note: This calculation might need adjustment if we only fetch Pending orders.
        // For now, keeping it as is, but it will likely be 0 if we only fetch Pending.
        // To get total sales, we'd need a separate query for 'Accepted'/'Delivered' orders or a broader query.
        // Given constraints, we'll leave this as is for now, acknowledging it only counts loaded orders.
        const totalSales = ordersData
          .filter(o => o.status === 'delivered')
          .reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);

        setStats(prev => ({ ...prev, totalSales }));

      } catch (error) {
        console.error('Error processing orders snapshot:', error);
      }
    }, (error) => {
      console.error('Error in orders listener:', error);
      toast.error('Error loading orders');
    });

    return unsubscribe;
  };

  // DEBUG: Diagnostic tool to check Firestore structure
  const debugDataStructure = async () => {
    try {
      console.log('--- START DIAGNOSTIC CHECK ---');
      const ordersRef = collection(db, 'orders');
      // Import limit if missed
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      console.log(`Diagnostic: Fetched ${snapshot.size} recent orders from 'orders' collection.`);

      const limitedDocs = snapshot.docs.slice(0, 5);

      for (const orderDoc of limitedDocs) {
        console.log(`Checking Order: ${orderDoc.id}`);
        // Check storeOrders subcollection
        const storeOrdersRef = collection(orderDoc.ref, 'storeOrders');
        const storeOrdersSnap = await getDocs(storeOrdersRef);

        if (storeOrdersSnap.empty) {
          console.log(`  > No 'storeOrders' subcollection found.`);
        } else {
          console.log(`  > Found ${storeOrdersSnap.size} documents in 'storeOrders'.`);
          storeOrdersSnap.docs.forEach(doc => {
            console.log(`    > Doc ID: ${doc.id}`);
            console.log(`    > Data:`, doc.data());
          });
        }
      }
      console.log('--- END DIAGNOSTIC CHECK ---');
      toast.info('Check console for diagnostic logs');
    } catch (error) {
      console.error('Diagnostic failed:', error);
      toast.error('Diagnostic failed: ' + error.message);
    }
  };


  const updateStats = (productsList) => {
    const totalProducts = productsList.length;
    const activeProducts = productsList.filter(p => p.availability === true).length;
    const outOfStock = productsList.filter(p => !p.inStock).length;

    setStats(prev => ({
      ...prev,
      totalProducts,
      activeProducts,
      outOfStock
    }));
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
      filtered = filtered.filter(product => product.inStock === true);
    } else if (filters.availability === 'outOfStock') {
      filtered = filtered.filter(product => product.inStock === false);
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
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceHigh':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
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



  const handleAddProduct = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!newProduct.name.trim() || !newProduct.price || newProduct.price <= 0) {
        toast.error('Product name and price are required');
        return;
      }

      // Use image URL directly
      const imageUrl = newProduct.image;

      // Determine Unit based on category
      let unit = 'piece';
      if (vendorInfo.categoryName === 'Groceries' && newProduct.weightUnit) unit = newProduct.weightUnit;
      if (vendorInfo.categoryName === 'Fruits & Vegetables' && newProduct.weightUnitFruits) unit = newProduct.weightUnitFruits;
      if (vendorInfo.categoryName === 'Meat & Fish' && newProduct.weightUnitMeat) unit = newProduct.weightUnitMeat;

      // Prepare base product data
      const productData = {
        // Required Fields
        productName: newProduct.name.trim(),
        productDescription: newProduct.description.trim(),
        price: parseFloat(newProduct.price),
        productImage: imageUrl,
        stockQuantity: parseInt(newProduct.quantity) || 1,
        unit: unit,
        status: newProduct.availability ? 'active' : 'inactive',

        // Vendor Info
        hotelId: vendorInfo.id,
        storeName: vendorInfo.businessName,
        applicationId: vendorInfo.applicationId,
        categoryId: vendorInfo.categoryId,
        categoryName: vendorInfo.categoryName,

        // Common Fields
        requiresPrescription: newProduct.prescriptionRequired || false,
        isVeg: newProduct.isVeg,
        availability: newProduct.availability,

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        inStock: newProduct.inStock,
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
              productData.status = 'inactive';
              productData.availability = false;
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
        // Update existing product - remove createdAt for updates
        delete productData.createdAt;
        productData.updatedAt = serverTimestamp();
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        toast.success('Product updated successfully!');
      } else {
        // Add new product - save to products collection
        const docRef = await addDoc(collection(db, 'products'), productData);
        toast.success(`Product added successfully! ID: ${docRef.id}`);
      }

      // Reset form and close modal
      setShowProductModal(false);
      setEditingProduct(null);
      resetProductForm();

    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Failed to save product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.productName || product.name || '',
      description: product.productDescription || product.description || '',
      price: product.price || '',
      image: product.productImage || product.image || '',
      inStock: product.inStock !== false,
      availability: product.status === 'active' || product.availability === true,
      quantity: product.stockQuantity || product.quantity || 1,
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
      medicineType: product.medicineType || 'tablet',
      expiryDate: product.expiryDate || '',
      batchNumber: product.batchNumber || '',
      prescriptionRequired: product.prescriptionRequired || false,
      saltComposition: product.saltComposition || '',
      dosageInstructions: product.dosageInstructions || '',
      manufacturer: product.manufacturer || '',
      storageConditions: product.storageConditions || '',
      sideEffects: product.sideEffects || '',

      // Grocery specific
      groceryType: product.groceryType || 'staples',
      netWeight: product.netWeight || '',
      weightUnit: product.weightUnit || 'g',
      manufacturerGrocery: product.manufacturer || '',
      storageInstructions: product.storageInstructions || '',
      countryOfOrigin: product.countryOfOrigin || '',
      organic: product.organic || false,

      // Fruits & Vegetables specific
      fruitVegetableType: product.fruitVegetableType || 'fruits',
      weightFruits: product.weight || '',
      weightUnitFruits: product.weightUnit || 'g',
      organicFruit: product.organic || false,
      freshnessDuration: product.freshnessDuration || '',
      cutOption: product.cutOption || 'uncut',
      seasonalFruit: product.seasonal || false,
      storageInstructionsFruits: product.storageInstructions || '',

      // Meat & Fish specific
      meatFishType: product.meatFishType || 'chicken',
      cutType: product.cutType || 'curry-cut',
      weightMeat: product.weight || '',
      weightUnitMeat: product.weightUnit || 'g',
      freshFrozen: product.freshFrozen || 'fresh',
      source: product.source || '',
      packagingTypeMeat: product.packagingType || '',
      deliverySlot: product.deliverySlot || 'morning',
      storageInstructionsMeat: product.storageInstructions || '',

      // Dress & Gadgets specific
      gender: product.gender || 'unisex',
      size: product.size || '',
      colorOptions: product.colorOptions || '',
      fabricMaterial: product.fabricMaterial || '',
      fitType: product.fitType || 'regular',
      occasionDress: product.occasion || '',
      washCareInstructions: product.washCareInstructions || '',
      countryOfManufacture: product.countryOfManufacture || '',
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteDoc(doc(db, 'products', productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleToggleStock = async (productId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        inStock: !currentStatus,
        updatedAt: serverTimestamp()
      });
      toast.success(`Product marked as ${!currentStatus ? 'In Stock' : 'Out of Stock'}`);
    } catch (error) {
      console.error('Error updating stock status:', error);
      toast.error('Failed to update stock status');
    }
  };

  /*
   * ORDER DETAILS MODAL
   */
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const renderOrderModal = () => {
    if (!showOrderModal || !selectedOrder) return null;

    // Helper to calculate totals if not directly available
    const calculateTotal = () => {
      return selectedOrder.totalAmount || selectedOrder.amount || 0;
    };

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">

          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-bold text-gray-800">Order {selectedOrder.orderId ? `#${selectedOrder.orderId}` : `#${selectedOrder.id.slice(0, 8)}`}</h3>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedOrder.status === 'Accepted' || selectedOrder.status === 'Confirmed' || selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  selectedOrder.status === 'Rejected' || selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    selectedOrder.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {selectedOrder.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {selectedOrder.createdAt?.toDate?.().toLocaleString() || 'Date N/A'}
              </p>
            </div>
            <button
              onClick={() => setShowOrderModal(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Customer Details</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedOrder.customerName || selectedOrder.userName || 'Guest'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-4 h-4 flex items-center justify-center text-gray-400 text-xs">📞</span>
                    <span>{selectedOrder.customerPhone || selectedOrder.phoneNumber || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <Home className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="line-clamp-2">
                      {selectedOrder.deliveryAddress
                        ? `${selectedOrder.deliveryAddress.street || ''}, ${selectedOrder.deliveryAddress.city || ''}, ${selectedOrder.deliveryAddress.zipCode || ''}`
                        : 'No address provided'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Payment Summary</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Store Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  {/* Assuming delivery fee is handled at parent order level, but if store specific, add here */}
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                    <span>Grand Total</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Items Ordered</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="px-4 py-2 text-left">Product</th>
                      <th className="px-4 py-2 text-right">Price</th>
                      <th className="px-4 py-2 text-center">Qty</th>
                      <th className="px-4 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="divide-y divide-gray-100">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{item.productName || item.name}</div>
                          {item.variant && <div className="text-xs text-gray-500">{item.variant}</div>}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">₹{item.price}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          ₹{item.totalPrice || (item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                    {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-gray-500 italic">
                          No items found in this order.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
            <button
              onClick={() => setShowOrderModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>

            {selectedOrder.status === 'Pending' && (
              <>
                <button
                  onClick={() => {
                    handleRejectOrder(selectedOrder.id, selectedOrder.storeDocId);
                    setShowOrderModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Reject Order
                </button>
                <button
                  onClick={() => {
                    handleAcceptOrder(selectedOrder.id, selectedOrder.storeDocId);
                    setShowOrderModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Accept Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* 
   * VENDOR ACCEPT / REJECT LOGIC
   */
  const handleAcceptOrder = async (orderId, storeDocId) => {
    try {
      console.log(`Accepting order: ${orderId}, storeDocId: ${storeDocId}`);

      // 1. Update storeStatus = "Accepted"
      const storeOrderRef = doc(db, 'orders', orderId, 'storeOrders', storeDocId);
      await updateDoc(storeOrderRef, {
        storeStatus: 'Accepted',
        // status: 'Accepted' // Maintain legacy field if needed, but prioritizing storeStatus as per instructions
      });

      toast.success('Order accepted');

      // 2. Check all storeOrders under that orderId
      const parentOrderRef = doc(db, 'orders', orderId);
      const storeOrdersCollectionRef = collection(parentOrderRef, 'storeOrders');
      const storeOrdersSnapshot = await getDocs(storeOrdersCollectionRef);

      let allAccepted = true;
      storeOrdersSnapshot.docs.forEach(doc => {
        const data = doc.data();
        // If any sibling is NOT Accepted (and NOT the one we just updated - though we just updated it so it should be fine to check DB if consistent, 
        // but better to check logic. We updated it, so subsequent fetch should show it. 
        // However, existing docs might have old status if not refreshed. 
        // Let's rely on data.storeStatus.
        // NOTE: We just updated storeOrderRef, but this snapshot might be slightly race-y if we don't wait or if local cache isn't immediate.
        // But await updateDoc should confirm write.
        if (doc.id === storeDocId) {
          // Treat the current one as Accepted (we just updated it)
          // In case snapshot returns old data
          return;
        }
        if (data.storeStatus !== 'Accepted') {
          allAccepted = false;
        }
      });

      // Re-verify the current one in case logical check above is confusing
      // Actually, we should just check if *every* doc in the fresh snapshot is Accepted. 
      // Note: The one we just updated IS in the snapshot if we fetched after update.
      const freshSnapshot = await getDocs(storeOrdersCollectionRef);
      const allStoresAccepted = freshSnapshot.docs.every(d => d.data().storeStatus === 'Accepted');

      // 3. If ALL storeStatus == "Accepted", update parent
      if (allStoresAccepted) {
        await updateDoc(parentOrderRef, {
          overallStatus: 'Confirmed',
          orderStatus: 'Confirmed'
        });
        toast.success('Order officially Confirmed!');
      }

    } catch (error) {
      console.error('Error accepting order:', error);
      toast.error('Failed to accept order');
    }
  };

  const handleRejectOrder = async (orderId, storeDocId) => {
    try {
      console.log(`Rejecting order: ${orderId}, storeDocId: ${storeDocId}`);

      // 1. Update storeStatus = "Rejected"
      const storeOrderRef = doc(db, 'orders', orderId, 'storeOrders', storeDocId);
      await updateDoc(storeOrderRef, {
        storeStatus: 'Rejected'
      });

      // 2. Update parent order
      const parentOrderRef = doc(db, 'orders', orderId);
      await updateDoc(parentOrderRef, {
        overallStatus: 'Rejected',
        orderStatus: 'Rejected'
      });

      toast.success('Order rejected');

    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    }
  };

  // Legacy/Generic status update (keeping as fallback or removing/commenting out if unused)
  /*
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    ... 
  };
  */

  const handleStoreStatusUpdate = async (newStatus) => {
    try {
      if (!vendorInfo?.id) return;

      await updateDoc(doc(db, 'hotels', vendorInfo.id), {
        open: newStatus
      });

      setVendorInfo(prev => ({ ...prev, open: newStatus }));
      toast.success(newStatus ? 'Store is now OPEN' : 'Store is now CLOSED');
    } catch (error) {
      console.error('Error updating store status:', error);
      toast.error('Failed to update store status');
    }
  };

  const handleSaveTimings = async (e) => {
    e.preventDefault();
    try {
      if (!vendorInfo?.id) return;

      const openingTime = e.target.openingTime.value;
      const closingTime = e.target.closingTime.value;

      await updateDoc(doc(db, 'hotels', vendorInfo.id), {
        openingTime,
        closingTime
      });

      setVendorInfo(prev => ({
        ...prev,
        openingTime,
        closingTime
      }));

      toast.success('Store timings updated successfully');
    } catch (error) {
      console.error('Error updating timings:', error);
      toast.error('Failed to update timings');
    }
  };

  const resetProductForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: '',
      image: '',
      imageFile: null,
      inStock: true,
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
      medicineType: 'tablet',
      expiryDate: '',
      batchNumber: '',
      prescriptionRequired: false,
      saltComposition: '',
      dosageInstructions: '',
      manufacturer: '',
      storageConditions: '',
      sideEffects: '',
      groceryType: 'staples',
      netWeight: '',
      weightUnit: 'g',
      manufacturerGrocery: '',
      storageInstructions: '',
      countryOfOrigin: '',
      fruitVegetableType: 'fruits',
      weightFruits: '',
      weightUnitFruits: 'g',
      organicFruit: false,
      freshnessDuration: '',
      cutOption: 'uncut',
      seasonalFruit: false,
      storageInstructionsFruits: '',
      meatFishType: 'chicken',
      cutType: 'curry-cut',
      weightMeat: '',
      weightUnitMeat: 'g',
      freshFrozen: 'fresh',
      source: '',
      packagingTypeMeat: '',
      deliverySlot: 'morning',
      storageInstructionsMeat: '',
      gender: 'unisex',
      size: '',
      colorOptions: '',
      fabricMaterial: '',
      fitType: 'regular',
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
                      onChange={(e) => setNewProduct({ ...newProduct, isVeg: true })}
                      className="mr-2"
                    />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isVeg"
                      checked={newProduct.isVeg === false}
                      onChange={(e) => setNewProduct({ ...newProduct, isVeg: false })}
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
                  onChange={(e) => setNewProduct({ ...newProduct, spiceLevel: e.target.value })}
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
                  onChange={(e) => setNewProduct({ ...newProduct, cuisine: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., South Indian, Chinese"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time</label>
                <input
                  type="text"
                  value={newProduct.preparationTime}
                  onChange={(e) => setNewProduct({ ...newProduct, preparationTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., 15-20 min"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
              <textarea
                value={newProduct.ingredients}
                onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
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
                  onChange={(e) => setNewProduct({ ...newProduct, calories: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., 250 kcal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Packaging Type</label>
                <input
                  type="text"
                  value={newProduct.packagingType}
                  onChange={(e) => setNewProduct({ ...newProduct, packagingType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Biodegradable"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={newProduct.bestseller}
                  onChange={(e) => setNewProduct({ ...newProduct, bestseller: e.target.checked })}
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
                  onChange={(e) => setNewProduct({ ...newProduct, medicineType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
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
                  onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  value={newProduct.batchNumber}
                  onChange={(e) => setNewProduct({ ...newProduct, batchNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Batch number"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={newProduct.prescriptionRequired}
                  onChange={(e) => setNewProduct({ ...newProduct, prescriptionRequired: e.target.checked })}
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
                onChange={(e) => setNewProduct({ ...newProduct, saltComposition: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="e.g., Paracetamol 500mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Instructions</label>
              <textarea
                value={newProduct.dosageInstructions}
                onChange={(e) => setNewProduct({ ...newProduct, dosageInstructions: e.target.value })}
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
                  onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Manufacturer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Storage Conditions</label>
                <input
                  type="text"
                  value={newProduct.storageConditions}
                  onChange={(e) => setNewProduct({ ...newProduct, storageConditions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., Store in cool dry place"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Side Effects (Optional)</label>
              <textarea
                value={newProduct.sideEffects}
                onChange={(e) => setNewProduct({ ...newProduct, sideEffects: e.target.value })}
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
                  onChange={(e) => setNewProduct({ ...newProduct, groceryType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
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
                    onChange={(e) => setNewProduct({ ...newProduct, netWeight: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., 500"
                  />
                  <select
                    value={newProduct.weightUnit}
                    onChange={(e) => setNewProduct({ ...newProduct, weightUnit: e.target.value })}
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
                  onChange={(e) => setNewProduct({ ...newProduct, manufacturerGrocery: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Manufacturer name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country of Origin</label>
                <input
                  type="text"
                  value={newProduct.countryOfOrigin}
                  onChange={(e) => setNewProduct({ ...newProduct, countryOfOrigin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="e.g., India"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Instructions</label>
              <textarea
                value={newProduct.storageInstructions}
                onChange={(e) => setNewProduct({ ...newProduct, storageInstructions: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows="2"
                placeholder="Storage instructions"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={newProduct.organic}
                onChange={(e) => setNewProduct({ ...newProduct, organic: e.target.checked })}
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
                onChange={(e) => setCategoryFilters({ ...categoryFilters, isVeg: e.target.value })}
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
                onChange={(e) => setCategoryFilters({ ...categoryFilters, spiceLevel: e.target.value })}
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
                onChange={(e) => setCategoryFilters({ ...categoryFilters, cuisine: e.target.value })}
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
                onChange={(e) => setCategoryFilters({ ...categoryFilters, bestseller: e.target.checked })}
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
                onChange={(e) => setCategoryFilters({ ...categoryFilters, medicineType: e.target.value })}
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
                onChange={(e) => setCategoryFilters({ ...categoryFilters, prescriptionRequired: e.target.value })}
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
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="1"
                      min="1"
                    />
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                      className="w-4 h-4 text-green-600"
                    />
                    <label className="text-sm font-medium text-gray-700">In Stock</label>
                  </div>
                </div>
              </div>

              {/* Product Image */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Product Image</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="https://example.com/product-image.jpg"
                  />
                  {newProduct.image && (
                    <div className="mt-4 relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={newProduct.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
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
              className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 my-1 rounded-lg transition-colors ${activeTab === item.id
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
                        <span className={`px-2 py-1 text-xs rounded-full ${product.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                        onClick={() => setFilters({ ...filters, viewMode: filters.viewMode === 'grid' ? 'list' : 'grid' })}
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
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      value={filters.availability}
                      onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    >
                      <option value="all">All Products</option>
                      <option value="active">In Stock</option>
                      <option value="outOfStock">Out of Stock</option>
                    </select>

                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
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
                          {!product.inStock && (
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
                              onClick={() => handleToggleStock(product.id, product.inStock)}
                              className={`flex-1 py-2 text-sm rounded-lg ${product.inStock
                                ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                            >
                              {product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
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
                                <span className={`px-2 py-1 text-xs rounded-full w-fit ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                  {product.inStock ? 'In Stock' : 'Out of Stock'}
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
                                  onClick={() => handleToggleStock(product.id, product.inStock)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                                  title={product.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                                >
                                  {product.inStock ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-800">Order Management</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-gray-500" />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm font-medium"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Order Details Modal Render Function */}
              {renderOrderModal}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.filter(order => {
                      if (filterStatus === 'All Status') return true;
                      // Handle case discrepancies
                      const s = order.status?.toLowerCase() || '';
                      const f = filterStatus.toLowerCase();
                      return s === f;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      orders.filter(order => {
                        if (filterStatus === 'All Status') return true;
                        const s = order.status?.toLowerCase() || '';
                        const f = filterStatus.toLowerCase();
                        return s === f;
                      }).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {order.orderId ? `#${order.orderId}` : `#${order.id.slice(0, 8)}`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {order.customerName || order.userName || 'Guest'}
                            <div className="text-xs text-gray-500">{order.deliveryAddress?.city}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="space-y-1">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="text-xs text-gray-700">
                                  {item.productName || item.name}
                                  <div className="text-gray-500 text-[10px]">
                                    ₹{item.price} • ₹{item.totalPrice || (item.price * item.quantity)}
                                  </div>
                                </div>
                              ))}
                              {(!order.items || order.items.length === 0) && (
                                <span className="text-xs text-gray-500">No items</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            ₹{order.totalAmount || order.amount}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'Accepted' || order.status === 'Confirmed' || order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Rejected' || order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {/* {order.status.charAt(0).toUpperCase() + order.status.slice(1)} */}
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {order.createdAt?.toDate?.().toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="p-1 px-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 text-xs font-medium"
                              >
                                View
                              </button>
                              {/* Action Buttons based on status */}
                              {order.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleAcceptOrder(order.id, order.storeDocId)}
                                    className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded hover:bg-green-100"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleRejectOrder(order.id, order.storeDocId)}
                                    className="px-3 py-1 bg-red-50 text-red-700 text-xs rounded hover:bg-red-100"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {order.status === 'Accepted' && (
                                <span className="text-xs text-green-600">Accepted</span>
                              )}

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

          {activeTab === 'analytics' && vendorInfo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="text-3xl mb-4">🚧</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Coming Soon</h3>
              <p className="text-gray-600">Analytics section is under development</p>
            </div>
          )}

          {activeTab === 'settings' && vendorInfo && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Store Status Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Store Status</h3>
                    <p className="text-sm text-gray-500">Open or close your store manually</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${vendorInfo.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {vendorInfo.open ? 'OPEN' : 'CLOSED'}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Currently:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={vendorInfo.open}
                      onChange={(e) => handleStoreStatusUpdate(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                  </label>
                </div>
              </div>

              {/* Store Timings Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Store Timings</h3>
                  <p className="text-sm text-gray-500">Set your standard opening and closing hours</p>
                </div>

                <form onSubmit={handleSaveTimings} className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          name="openingTime"
                          defaultValue={vendorInfo.openingTime}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Closing Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="time"
                          name="closingTime"
                          defaultValue={vendorInfo.closingTime}
                          className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition"
                    >
                      Save Timings
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {renderProductModal()}
      {renderOrderModal()}
    </div>
  );
};

export default VendorDashboard;