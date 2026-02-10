/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/purity */
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestForm = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Section 1: Basic Business Information
    businessName: '',
    ownerName: '',
    email: '',
    mobile: '',
    businessType: '',
    storeAddress: '',
    operatingCity: '',

    // Section 2: Legal & Verification Details
    governmentIdType: 'aadhaar',
    governmentIdNumber: '',
    businessRegistrationType: 'individual',
    licenseType: '',
    licenseNumber: '',
    licenseDocument: null,

    // Section 3: Store & Category Details
    storeCategory: '',
    subCategories: [],
    openingTime: '',
    closingTime: '',
    deliveryAvailable: true,

    // Store Image/Image URL (Important for store listing)
    storeImage: null,
    storeImageUrl: '',

    // Business specific fields based on category - ALL fields from Admin Dashboard
    // These fields will populate filters in StoreListingScreen
    isVeg: false,
    cuisine: 'South Indian',
    priceRange: '₹₹',

    // Medicine specific fields
    medicineType: 'Pharmacy',
    requiresPrescription: false,
    is24x7: false,
    generic: false,
    discounted: false,
    inStock: true,

    // Groceries specific fields
    groceryType: 'Supermarket',
    organic: false,
    comboPacks: false,
    fastDelivery: false,

    // Fruits & Vegetables specific fields
    fruitsType: 'Fruits Store',
    quality: 'Non-Organic',
    seasonal: false,
    freshArrival: false,

    // Meat & Fish specific fields
    meatType: 'Meat Shop',
    todaysCatch: false,
    bestSeller: false,

    // Dress & Gadgets specific fields
    dressType: 'Clothing Store',
    newArrivals: false,

    // Additional business details for all categories
    description: '',
    rating: 4.5,
    deliveryTime: '30-40',
    deliveryFee: 40,
    minOrder: 150,
    offers: '',
    website: '',
    commissionRate: 15,
    deliveryRadius: 5,
    avgPreparationTime: '20-40',
    featured: false,
    hygienePass: true,
    open: true,
    status: 'pending',

    // Section 4: Bank & Payment Details
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',

    // Section 5: Admin Review Section (hidden from vendor initially)
    verificationStatus: 'pending',
    adminNotes: '',
    approvalDate: '',
    isActive: false,
    applicationId: '',
  });

  const [errors, setErrors] = useState({});
  const [currentSection, setCurrentSection] = useState(1);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Fetch categories from Firebase on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
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
      toast.error('Failed to load categories. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile) => {
    const re = /^[6-9]\d{9}$/;
    return re.test(mobile);
  };

  const validateAadhaar = (aadhaar) => {
    const re = /^\d{12}$/;
    return re.test(aadhaar);
  };

  const validatePAN = (pan) => {
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return re.test(pan);
  };

  const validateIFSC = (ifsc) => {
    const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return re.test(ifsc);
  };

  const validateAccountNumber = (account) => {
    const re = /^\d{9,18}$/;
    return re.test(account);
  };

  const validateSection1 = () => {
    const newErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validateMobile(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select business type';
    }

    if (!formData.storeAddress.trim()) {
      newErrors.storeAddress = 'Store address is required';
    }

    if (!formData.operatingCity.trim()) {
      newErrors.operatingCity = 'Operating city is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSection2 = () => {
    const newErrors = {};

    if (!formData.governmentIdNumber.trim()) {
      newErrors.governmentIdNumber = 'Government ID number is required';
    } else if (formData.governmentIdType === 'aadhaar' && !validateAadhaar(formData.governmentIdNumber)) {
      newErrors.governmentIdNumber = 'Please enter a valid 12-digit Aadhaar number';
    } else if (formData.governmentIdType === 'pan' && !validatePAN(formData.governmentIdNumber)) {
      newErrors.governmentIdNumber = 'Please enter a valid PAN number (e.g., ABCDE1234F)';
    }

    if (!formData.licenseType) {
      newErrors.licenseType = 'Please select license type';
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = 'License number is required';
    }

    if (!formData.licenseDocument) {
      newErrors.licenseDocument = 'Please upload license document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSection3 = () => {
    const newErrors = {};

    if (!formData.storeCategory) {
      newErrors.storeCategory = 'Please select store category';
    }

    if (!formData.openingTime) {
      newErrors.openingTime = 'Opening time is required';
    }

    if (!formData.closingTime) {
      newErrors.closingTime = 'Closing time is required';
    }

    // Store image validation
    if (!formData.storeImage && !formData.storeImageUrl.trim()) {
      newErrors.storeImage = 'Please upload a store image or provide an image URL';
    }

    // Additional validation based on category name from Firebase
    const selectedCategory = categories.find(cat => cat.id === formData.storeCategory);
    if (selectedCategory) {
      const categoryName = selectedCategory.name;

      // Food category validation
      if (categoryName === 'Food') {
        if (!formData.cuisine) {
          newErrors.cuisine = 'Cuisine is required for food category';
        }
        if (!formData.priceRange) {
          newErrors.priceRange = 'Price range is required for food category';
        }
      }

      // Medicine category validation
      if (categoryName === 'Medicine' && !formData.medicineType) {
        newErrors.medicineType = 'Medicine type is required for medical stores';
      }

      // Groceries category validation
      if (categoryName === 'Groceries' && !formData.groceryType) {
        newErrors.groceryType = 'Grocery type is required';
      }

      // Fruits & Vegetables category validation
      if (categoryName === 'Fruits & Vegetables' && !formData.fruitsType) {
        newErrors.fruitsType = 'Store type is required for fruits & vegetables';
      }

      // Meat & Fish category validation
      if (categoryName === 'Meat & Fish' && !formData.meatType) {
        newErrors.meatType = 'Shop type is required for meat & fish';
      }

      // Dress & Gadgets category validation
      if (categoryName === 'Dress & Gadgets' && !formData.dressType) {
        newErrors.dressType = 'Store type is required for dress & gadgets';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSection4 = () => {
    const newErrors = {};

    if (!formData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!formData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!validateAccountNumber(formData.accountNumber)) {
      newErrors.accountNumber = 'Please enter a valid account number (9-18 digits)';
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = 'IFSC code is required';
    } else if (!validateIFSC(formData.ifscCode)) {
      newErrors.ifscCode = 'Please enter a valid IFSC code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file (JPEG, PNG, etc.)');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size should be less than 2MB for optimal performance');
        return;
      }

      setFormData(prev => ({
        ...prev,
        storeImage: file,
        storeImageUrl: '' // Clear URL if uploading file
      }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Clear error
      if (errors.storeImage) {
        setErrors(prev => ({ ...prev, storeImage: '' }));
      }
    }
  };

  // Clear image selection
  const clearImageSelection = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
    }
    setFormData(prev => ({
      ...prev,
      storeImage: null,
      storeImageUrl: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'file') {
      if (name === 'storeImage') {
        handleImageUpload(e);
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: files[0]
        }));
      }
    } else if (name === 'storeCategory') {
      // Get selected category name
      const selectedCategory = categories.find(cat => cat.id === value);
      const categoryName = selectedCategory ? selectedCategory.name : '';

      // Reset category-specific fields when category changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Reset business specific fields when category changes
        cuisine: 'South Indian',
        priceRange: '₹₹',
        medicineType: 'Pharmacy',
        groceryType: 'Supermarket',
        fruitsType: 'Fruits Store',
        meatType: 'Meat Shop',
        dressType: 'Clothing Store',
        isVeg: categoryName === 'Fruits & Vegetables', // Auto-set isVeg for fruits category
        quality: 'Non-Organic',
        requiresPrescription: false,
        is24x7: false,
        generic: false,
        discounted: false,
        inStock: true,
        organic: false,
        comboPacks: false,
        fastDelivery: false,
        seasonal: false,
        freshArrival: false,
        todaysCatch: false,
        bestSeller: false,
        newArrivals: false,
        featured: false,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Map Firebase category IDs to category names for business logic
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  // Render business-specific fields based on category
  const renderBusinessSpecificFields = () => {
    const categoryName = getCategoryName(formData.storeCategory);

    switch (categoryName) {
      case 'Food':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Restaurant Details (Will appear in Filters)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine *</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.cuisine ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Multi-Cuisine">Multi-Cuisine</option>
                  <option value="Continental">Continental</option>
                  <option value="Street Food">Street Food</option>
                  <option value="Desserts">Desserts</option>
                </select>
                {errors.cuisine && (
                  <p className="text-red-500 text-sm mt-1">{errors.cuisine}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range *</label>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.priceRange ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="₹">Budget (₹)</option>
                  <option value="₹₹">Moderate (₹₹)</option>
                  <option value="₹₹₹">Premium (₹₹₹)</option>
                  <option value="₹₹₹₹">Luxury (₹₹₹₹)</option>
                </select>
                {errors.priceRange && (
                  <p className="text-red-500 text-sm mt-1">{errors.priceRange}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Pure Vegetarian (Will appear in Veg/Non-Veg filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Bestseller (Will appear in Bestseller filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Featured Restaurant
                </label>
              </div>
            </div>
          </div>
        );

      case 'Medicine':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Medical Store Details (Will appear in Filters)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Type *</label>
                <select
                  name="medicineType"
                  value={formData.medicineType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.medicineType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Pharmacy">General Pharmacy</option>
                  <option value="24x7 Pharmacy">24x7 Pharmacy</option>
                  <option value="Generic Medicine Store">Generic Medicine Store</option>
                  <option value="Ayurvedic Store">Ayurvedic Store</option>
                  <option value="Homeopathic Store">Homeopathic Store</option>
                  <option value="OTC">OTC Store</option>
                  <option value="Allopathy">Allopathy</option>
                  <option value="Medical Devices">Medical Devices Store</option>
                </select>
                {errors.medicineType && (
                  <p className="text-red-500 text-sm mt-1">{errors.medicineType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="is24x7"
                  checked={formData.is24x7}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  24×7 Store (Will appear in 24×7 filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="generic"
                  checked={formData.generic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Generic Medicines Available (Will appear in Generic filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="discounted"
                  checked={formData.discounted}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Discounted Medicines (Will appear in Discounted filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="requiresPrescription"
                  checked={formData.requiresPrescription}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Requires Prescription
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Currently In Stock (Will appear in In Stock filter)
              </label>
            </div>
          </div>
        );

      case 'Groceries':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Grocery Store Details (Will appear in Filters)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Type *</label>
                <select
                  name="groceryType"
                  value={formData.groceryType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.groceryType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Supermarket">Supermarket</option>
                  <option value="Kirana Store">Kirana Store</option>
                  <option value="Organic Store">Organic Store</option>
                  <option value="Bulk Store">Bulk Store</option>
                  <option value="Convenience Store">Convenience Store</option>
                  <option value="Specialty Store">Specialty Store</option>
                  <option value="Staples">Staples Store</option>
                  <option value="Snacks & Beverages">Snacks & Beverages</option>
                  <option value="Dairy Products">Dairy Products</option>
                </select>
                {errors.groceryType && (
                  <p className="text-red-500 text-sm mt-1">{errors.groceryType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="organic"
                  checked={formData.organic}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Organic Products (Will appear in Organic filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="comboPacks"
                  checked={formData.comboPacks}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Combo Packs Available (Will appear in Combo Packs filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="fastDelivery"
                  checked={formData.fastDelivery}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Fast Delivery (Will appear in Fast Delivery filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Currently In Stock (Will appear in In Stock filter)
                </label>
              </div>
            </div>
          </div>
        );

      case 'Fruits & Vegetables':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Fruits & Vegetables Store Details (Will appear in Filters)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Type *</label>
                <select
                  name="fruitsType"
                  value={formData.fruitsType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.fruitsType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Fruits Store">Fruits Store</option>
                  <option value="Vegetables Store">Vegetables Store</option>
                  <option value="Fruits & Vegetables">Both Fruits & Vegetables</option>
                  <option value="Organic Store">Organic Store</option>
                  <option value="Juice Center">Juice Center</option>
                  <option value="Exotic Fruits">Exotic Fruits</option>
                  <option value="Exotic Vegetables">Exotic Vegetables</option>
                  <option value="Leafy Greens">Leafy Greens</option>
                  <option value="Local Market">Local Market Vendor</option>
                </select>
                {errors.fruitsType && (
                  <p className="text-red-500 text-sm mt-1">{errors.fruitsType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quality Type *</label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="Non-Organic">Non-Organic</option>
                  <option value="Organic">Organic</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="seasonal"
                  checked={formData.seasonal}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Seasonal Products (Will appear in Seasonal filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="freshArrival"
                  checked={formData.freshArrival}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Fresh Arrival (Will appear in Fresh Arrival filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Bestseller (Will appear in Bestseller filter)
                </label>
              </div>
            </div>
          </div>
        );

      case 'Meat & Fish':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Meat & Fish Shop Details (Will appear in Filters)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shop Type *</label>
                <select
                  name="meatType"
                  value={formData.meatType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.meatType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Meat Shop">Meat Shop</option>
                  <option value="Fish Shop">Fish Shop</option>
                  <option value="Both Meat & Fish">Both Meat & Fish</option>
                  <option value="Chicken Speciality">Chicken Speciality</option>
                  <option value="Mutton Speciality">Mutton Speciality</option>
                  <option value="Seafood">Seafood Shop</option>
                  <option value="Halal Meat">Halal Meat Shop</option>
                  <option value="Frozen Meat">Frozen Meat Shop</option>
                  <option value="Chicken">Chicken</option>
                  <option value="Mutton">Mutton</option>
                  <option value="Fish">Fish</option>
                  <option value="Prawns">Prawns</option>
                  <option value="Crab">Crab</option>
                  <option value="Eggs">Eggs</option>
                </select>
                {errors.meatType && (
                  <p className="text-red-500 text-sm mt-1">{errors.meatType}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="todaysCatch"
                  checked={formData.todaysCatch}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Today's Catch (Will appear in Today's Catch filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={formData.bestSeller}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Bestseller (Will appear in Bestseller filter)
                </label>
              </div>
            </div>
          </div>
        );

      case 'Dress & Gadgets':
        return (
          <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Dress & Gadgets Store Details (Will appear in Filters)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Type *</label>
                <select
                  name="dressType"
                  value={formData.dressType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.dressType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Clothing Store">Clothing Store</option>
                  <option value="Electronics Store">Electronics Store</option>
                  <option value="Both Clothing & Electronics">Both Clothing & Electronics</option>
                  <option value="Mobile Store">Mobile Store</option>
                  <option value="Footwear Store">Footwear Store</option>
                  <option value="Accessories Store">Accessories Store</option>
                  <option value="Department Store">Department Store</option>
                  <option value="Brand Outlet">Brand Outlet</option>
                  <option value="Casual Wear">Casual Wear</option>
                  <option value="Formal Wear">Formal Wear</option>
                  <option value="Ethnic Wear">Ethnic Wear</option>
                  <option value="Party Wear">Party Wear</option>
                  <option value="Sports Wear">Sports Wear</option>
                </select>
                {errors.dressType && (
                  <p className="text-red-500 text-sm mt-1">{errors.dressType}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range *</label>
                <select
                  name="priceRange"
                  value={formData.priceRange}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.priceRange ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="Budget">Budget</option>
                  <option value="Mid Range">Mid Range</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
                {errors.priceRange && (
                  <p className="text-red-500 text-sm mt-1">{errors.priceRange}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="newArrivals"
                  checked={formData.newArrivals}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  New Arrivals (Will appear in New Arrivals filter)
                </label>
              </div>

              <div className="flex items-center gap-2 p-3 bg-white rounded-xl">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Featured Store
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Store Image Upload Section
  const renderStoreImageSection = () => {
    return (
      <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Store Image (Required for Store Listing)</h3>
        <p className="text-sm text-gray-600 mb-4">This image will appear in the store listing and is mandatory for better visibility.</p>

        <div className="space-y-4">
          {/* Image Upload Option */}
          <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.storeImage ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
            <input
              type="file"
              name="storeImage"
              onChange={handleInputChange}
              accept="image/*"
              className="hidden"
              id="storeImageUpload"
            />
            <label htmlFor="storeImageUpload" className="cursor-pointer block">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">Click to upload store image</p>
              <p className="text-xs text-gray-500 mt-1">JPEG, PNG up to 2MB</p>
            </label>
            {formData.storeImage && (
              <div className="mt-4">
                <p className="text-sm text-green-600">
                  Selected: {formData.storeImage.name}
                </p>
                <button
                  type="button"
                  onClick={clearImageSelection}
                  className="text-sm text-red-600 hover:text-red-800 mt-2"
                >
                  Remove image
                </button>
              </div>
            )}
            {errors.storeImage && (
              <p className="text-red-500 text-sm mt-2">{errors.storeImage}</p>
            )}
          </div>

          {/* OR Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">OR</span>
            </div>
          </div>

          {/* Image URL Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL (Alternative to upload)
            </label>
            <input
              type="url"
              name="storeImageUrl"
              value={formData.storeImageUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/store-image.jpg"
              disabled={!!formData.storeImage}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${formData.storeImage ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide a direct image URL if you don't want to upload a file
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <div className="w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="Store preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Additional business details fields
  const renderAdditionalBusinessDetails = () => {
    return (
      <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Additional Business Details (For Store Listing)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
            <input
              type="text"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="30-40 min"
            />
            <p className="text-xs text-gray-500 mt-1">Will appear in store listing</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order (₹)</label>
            <input
              type="number"
              name="minOrder"
              value={formData.minOrder}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="150"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (₹)</label>
            <input
              type="number"
              name="deliveryFee"
              value={formData.deliveryFee}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="40"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="4.5"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website URL (Optional)</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Radius (km)</label>
            <input
              type="number"
              name="deliveryRadius"
              value={formData.deliveryRadius}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="5"
              min="1"
              max="20"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Brief description about your business, specialties, etc. This will appear in store listing."
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Special Offers (Will appear in Offers filter)</label>
          <input
            type="text"
            name="offers"
            value={formData.offers}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="e.g., 20% OFF on first order, Free delivery above ₹300, Buy 1 Get 1 Free"
          />
          <p className="text-xs text-gray-500 mt-1">Offers will be displayed in store listing and appear in offers filter</p>
        </div>
      </div>
    );
  };

  const handleNext = () => {
    let isValid = true;

    switch (currentSection) {
      case 1:
        isValid = validateSection1();
        break;
      case 2:
        isValid = validateSection2();
        break;
      case 3:
        isValid = validateSection3();
        break;
      case 4:
        isValid = validateSection4();
        break;
    }

    if (isValid) {
      setCurrentSection(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const handleBack = () => {
    setCurrentSection(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const generateApplicationId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `VEND${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation
    if (!validateSection1() || !validateSection2() || !validateSection3() || !validateSection4()) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const applicationId = generateApplicationId();
      const selectedCategory = categories.find(cat => cat.id === formData.storeCategory);
      const categoryName = selectedCategory ? selectedCategory.name : '';
      const categoryId = formData.storeCategory;

      // Prepare filters object based on category
      let filters = {};
      const selectedCategoryName = getCategoryName(formData.storeCategory);

      switch (selectedCategoryName) {
        case 'Food':
          filters = {
            bestSeller: formData.bestSeller,
            isVeg: formData.isVeg,
            cuisine: formData.cuisine,
            rating: parseFloat(formData.rating) || 4.5,
            offers: formData.offers ? true : false
          };
          break;
        case 'Medicine':
          filters = {
            is24x7: formData.is24x7,
            generic: formData.generic,
            discounted: formData.discounted,
            inStock: formData.inStock,
            requiresPrescription: formData.requiresPrescription
          };
          break;
        case 'Groceries':
          filters = {
            organic: formData.organic,
            comboPacks: formData.comboPacks,
            fastDelivery: formData.fastDelivery,
            inStock: formData.inStock,
            groceryType: formData.groceryType
          };
          break;
        case 'Fruits & Vegetables':
          filters = {
            organic: formData.quality === 'Organic',
            seasonal: formData.seasonal,
            freshArrival: formData.freshArrival,
            bestSeller: formData.bestSeller,
            quality: formData.quality
          };
          break;
        case 'Meat & Fish':
          filters = {
            todaysCatch: formData.todaysCatch,
            bestSeller: formData.bestSeller,
            meatType: formData.meatType
          };
          break;
        case 'Dress & Gadgets':
          filters = {
            newArrivals: formData.newArrivals,
            offers: formData.offers ? true : false,
            dressType: formData.dressType
          };
          break;
      }

      // Handle Image Conversion
      let imageBase64 = '';
      if (formData.storeImage) {
        imageBase64 = await fileToBase64(formData.storeImage);
      }

      // Prepare data for hotels collection
      const hotelData = {
        // Basic Info
        name: formData.businessName.trim(),
        description: formData.description.trim(),

        // Category Information
        categoryId: categoryId,
        categoryName: categoryName,

        // Contact Information
        email: formData.email.trim(),
        phone: formData.mobile.trim(),
        address: formData.storeAddress.trim(),

        // Owner Information
        ownerName: formData.ownerName.trim(),
        operatingCity: formData.operatingCity.trim(),

        // Ratings & Pricing
        rating: parseFloat(formData.rating) || 4.5,

        // Delivery Info
        deliveryTime: formData.deliveryTime.trim(),
        deliveryFee: parseFloat(formData.deliveryFee) || 40,
        minOrder: parseFloat(formData.minOrder) || 150,
        avgPreparationTime: formData.avgPreparationTime || '20-40',

        // Business Type
        businessType: categoryName === 'Food' ? 'restaurant' : 'store',

        // Category-specific data (for filters)
        ...(categoryName === 'Food' && {
          cuisine: formData.cuisine,
          priceRange: formData.priceRange,
          isVeg: formData.isVeg
        }),
        ...(categoryName === 'Medicine' && {
          medicineType: formData.medicineType,
          isVeg: false,
          requiresPrescription: formData.requiresPrescription
        }),
        ...(categoryName === 'Groceries' && {
          groceryType: formData.groceryType,
          isVeg: false
        }),
        ...(categoryName === 'Fruits & Vegetables' && {
          fruitsType: formData.fruitsType,
          isVeg: true,
          isOrganic: formData.quality === 'Organic'
        }),
        ...(categoryName === 'Meat & Fish' && {
          meatType: formData.meatType,
          isVeg: false
        }),
        ...(categoryName === 'Dress & Gadgets' && {
          dressType: formData.dressType,
          priceRange: formData.priceRange,
          isVeg: false
        }),

        // Media - Store Image
        image: formData.storeImage ? imageBase64 : (formData.storeImageUrl || ''),
        imageStorageType: formData.storeImage ? 'base64' : (formData.storeImageUrl ? 'url' : 'url'),
        offers: formData.offers.trim(),

        // Filters for store listing
        filters: filters,

        // Status & Settings
        status: 'pending',
        featured: formData.featured,
        open: formData.open,
        hygienePass: formData.hygienePass,

        // Business Metrics
        commissionRate: formData.commissionRate || 15,
        deliveryRadius: formData.deliveryRadius || 5,
        orderCount: 0,
        totalEarnings: 0,

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        // Additional fields
        website: formData.website || '',

        // Store timings
        openingTime: formData.openingTime,
        closingTime: formData.closingTime,
        deliveryAvailable: formData.deliveryAvailable,

        // Application details (for tracking)
        applicationId: applicationId,
        verificationStatus: 'pending',
        viewedByAdmin: false,
        rejectionReason: '',

        // Legal information
        governmentIdType: formData.governmentIdType,
        governmentIdNumber: formData.governmentIdNumber,
        licenseType: formData.licenseType,
        licenseNumber: formData.licenseNumber,
        businessRegistrationType: formData.businessRegistrationType,

        // Bank details
        accountHolderName: formData.accountHolderName.trim(),
        bankName: formData.bankName.trim(),
        accountNumber: formData.accountNumber.trim(),
        ifscCode: formData.ifscCode.toUpperCase(),
        upiId: formData.upiId.trim(),

        // Additional filter fields
        bestSeller: formData.bestSeller || false,
        newArrivals: formData.newArrivals || false,
        organic: formData.organic || false,
        comboPacks: formData.comboPacks || false,
        fastDelivery: formData.fastDelivery || false,
        seasonal: formData.seasonal || false,
        freshArrival: formData.freshArrival || false,
        todaysCatch: formData.todaysCatch || false,
        is24x7: formData.is24x7 || false,
        generic: formData.generic || false,
        discounted: formData.discounted || false,
        inStock: formData.inStock !== false,
      };

      // Save to Firebase hotels collection
      const hotelsCollection = collection(db, 'hotels');
      await addDoc(hotelsCollection, hotelData);

      setApplicationNumber(applicationId);
      setFormSubmitted(true);
      toast.success('Application submitted successfully!');

      // Clean up image preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      // Log for debugging
      console.log('Application submitted to hotels collection:', hotelData);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">VENDOR REQUEST FORM</h1>
          <p className="text-gray-600 mt-2">Complete all sections to apply for vendor account</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentSection >= num ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {num}
                </div>
                <span className="text-xs mt-1 text-gray-600">
                  {num === 1 && 'Business Info'}
                  {num === 2 && 'Legal Details'}
                  {num === 3 && 'Store Details'}
                  {num === 4 && 'Bank Details'}
                  {num === 5 && 'Review'}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-yellow-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentSection - 1) * 25}%` }}
            ></div>
          </div>
        </div>

        {!formSubmitted ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">

            {/* SECTION 1: Basic Business Information */}
            {currentSection === 1 && (
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mr-3">1</span>
                    Basic Business Information
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">These are mandatory fields</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.businessName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.ownerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.ownerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email ID *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.mobile && (
                      <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.businessType ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select Business Type</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="store">Store</option>
                    </select>
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Operating City / Zone *
                    </label>
                    <input
                      type="text"
                      name="operatingCity"
                      value={formData.operatingCity}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.operatingCity ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="For admin categorization"
                    />
                    {errors.operatingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.operatingCity}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Store Address *
                  </label>
                  <textarea
                    name="storeAddress"
                    value={formData.storeAddress}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.storeAddress ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Street, Area, City, Pincode"
                  ></textarea>
                  {errors.storeAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.storeAddress}</p>
                  )}
                </div>
              </div>
            )}

            {/* SECTION 2: Legal & Verification Details */}
            {currentSection === 2 && (
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mr-3">2</span>
                    Legal & Verification Details
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Required for trust & compliance</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Government ID (Owner) *
                    </label>
                    <select
                      name="governmentIdType"
                      value={formData.governmentIdType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent mb-2"
                    >
                      <option value="aadhaar">Aadhaar</option>
                      <option value="pan">PAN</option>
                    </select>
                    <input
                      type="text"
                      name="governmentIdNumber"
                      value={formData.governmentIdNumber}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.governmentIdNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder={
                        formData.governmentIdType === 'aadhaar'
                          ? '12-digit Aadhaar number'
                          : 'PAN number (e.g., ABCDE1234F)'
                      }
                    />
                    {errors.governmentIdNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.governmentIdNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Registration Type *
                    </label>
                    <select
                      name="businessRegistrationType"
                      value={formData.businessRegistrationType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      <option value="individual">Individual</option>
                      <option value="partnership">Partnership</option>
                      <option value="company">Company</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Type *
                    </label>
                    <select
                      name="licenseType"
                      value={formData.licenseType}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.licenseType ? 'border-red-500' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select License Type</option>
                      <option value="fssai">FSSAI (Food)</option>
                      <option value="drug">Drug License (Medical)</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.licenseType && (
                      <p className="text-red-500 text-sm mt-1">{errors.licenseType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Number *
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Document Upload *
                  </label>
                  <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.licenseDocument ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}>
                    <input
                      type="file"
                      name="licenseDocument"
                      onChange={handleInputChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      required
                      className="hidden"
                      id="licenseUpload"
                    />
                    <label htmlFor="licenseUpload" className="cursor-pointer">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-gray-600">Click to upload document</p>
                      <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 5MB</p>
                    </label>
                    {formData.licenseDocument && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {formData.licenseDocument.name}
                      </p>
                    )}
                    {errors.licenseDocument && (
                      <p className="text-red-500 text-sm mt-1">{errors.licenseDocument}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: Store & Category Details */}
            {currentSection === 3 && (
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mr-3">3</span>
                    Store & Category Details
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">These details will appear in store listing and be used for filters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Requested Store Category *
                    </label>
                    <select
                      name="storeCategory"
                      value={formData.storeCategory}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.storeCategory ? 'border-red-500' : 'border-gray-300'
                        }`}
                      disabled={loading}
                    >
                      <option value="">{loading ? 'Loading categories...' : 'Select Category'}</option>
                      {categories
                        .filter(cat => cat.status === 'active')
                        .map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.storeCategory && (
                      <p className="text-red-500 text-sm mt-1">{errors.storeCategory}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Selected category will determine available filters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Opening Time *
                    </label>
                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.openingTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.openingTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.openingTime}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Closing Time *
                    </label>
                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.closingTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.closingTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.closingTime}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="deliveryAvailable"
                        checked={formData.deliveryAvailable}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Delivery Available</span>
                    </label>
                  </div>
                </div>

                {/* Store Image Section */}
                {renderStoreImageSection()}

                {/* Render business specific fields based on category */}
                {formData.storeCategory && renderBusinessSpecificFields()}

                {/* Additional business details */}
                {renderAdditionalBusinessDetails()}
              </div>
            )}

            {/* SECTION 4: Bank & Payment Details */}
            {currentSection === 4 && (
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mr-3">4</span>
                    Bank & Payment Details
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Used for payouts</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Holder Name *
                    </label>
                    <input
                      type="text"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.accountHolderName && (
                      <p className="text-red-500 text-sm mt-1">{errors.accountHolderName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bank Name *
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.bankName ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.bankName && (
                      <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.accountNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IFSC Code *
                    </label>
                    <input
                      type="text"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${errors.ifscCode ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.ifscCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.ifscCode}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      UPI ID (Optional)
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="username@upi"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: Review */}
            {currentSection === 5 && (
              <div className="space-y-6">
                <div className="border-b pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <span className="w-8 h-8 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center mr-3">5</span>
                    Review & Submit
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">Review all information before submitting</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Important:</span> Your application will be reviewed by admin. Status updates will be sent to your email.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Business Info</h3>
                      <p className="text-sm text-gray-600">Name: {formData.businessName}</p>
                      <p className="text-sm text-gray-600">Owner: {formData.ownerName}</p>
                      <p className="text-sm text-gray-600">Email: {formData.email}</p>
                      <p className="text-sm text-gray-600">City: {formData.operatingCity}</p>
                      <p className="text-sm text-gray-600">Type: {formData.businessType}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Legal Information</h3>
                      <p className="text-sm text-gray-600">
                        Government ID Number: {formData.governmentIdNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Account Number: {formData.accountNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        License Number: {formData.licenseNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        License Type: {formData.licenseType}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">Store Details</h3>
                      <p className="text-sm text-gray-600">Category: {getCategoryName(formData.storeCategory)}</p>
                      <p className="text-sm text-gray-600">Timings: {formData.openingTime} - {formData.closingTime}</p>
                      <p className="text-sm text-gray-600">Delivery: {formData.deliveryAvailable ? 'Yes' : 'No'}</p>
                      <p className="text-sm text-gray-600">Image: {formData.storeImage || formData.storeImageUrl ? 'Provided' : 'Not Provided'}</p>

                      {/* Category-specific details */}
                      {formData.cuisine && (
                        <>
                          <p className="text-sm text-gray-600">Cuisine: {formData.cuisine}</p>
                          <p className="text-sm text-gray-600">Price Range: {formData.priceRange}</p>
                          <p className="text-sm text-gray-600">Vegetarian: {formData.isVeg ? 'Yes' : 'No'}</p>
                          <p className="text-sm text-gray-600">Bestseller: {formData.bestSeller ? 'Yes' : 'No'}</p>
                        </>
                      )}
                      {formData.medicineType && (
                        <>
                          <p className="text-sm text-gray-600">Store Type: {formData.medicineType}</p>
                          <p className="text-sm text-gray-600">24×7: {formData.is24x7 ? 'Yes' : 'No'}</p>
                          <p className="text-sm text-gray-600">Generic: {formData.generic ? 'Yes' : 'No'}</p>
                        </>
                      )}
                      {formData.groceryType && (
                        <>
                          <p className="text-sm text-gray-600">Store Type: {formData.groceryType}</p>
                          <p className="text-sm text-gray-600">Organic: {formData.organic ? 'Yes' : 'No'}</p>
                          <p className="text-sm text-gray-600">Combo Packs: {formData.comboPacks ? 'Yes' : 'No'}</p>
                        </>
                      )}
                      {formData.fruitsType && (
                        <>
                          <p className="text-sm text-gray-600">Store Type: {formData.fruitsType}</p>
                          <p className="text-sm text-gray-600">Quality: {formData.quality}</p>
                          <p className="text-sm text-gray-600">Seasonal: {formData.seasonal ? 'Yes' : 'No'}</p>
                        </>
                      )}
                      {formData.meatType && (
                        <>
                          <p className="text-sm text-gray-600">Shop Type: {formData.meatType}</p>
                          <p className="text-sm text-gray-600">Today's Catch: {formData.todaysCatch ? 'Yes' : 'No'}</p>
                          <p className="text-sm text-gray-600">Bestseller: {formData.bestSeller ? 'Yes' : 'No'}</p>
                        </>
                      )}
                      {formData.dressType && (
                        <>
                          <p className="text-sm text-gray-600">Store Type: {formData.dressType}</p>
                          <p className="text-sm text-gray-600">Price Range: {formData.priceRange}</p>
                          <p className="text-sm text-gray-600">New Arrivals: {formData.newArrivals ? 'Yes' : 'No'}</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Business Details for Store Listing</h3>
                    <p className="text-sm text-gray-600">Delivery Time: {formData.deliveryTime}</p>
                    <p className="text-sm text-gray-600">Min Order: ₹{formData.minOrder}</p>
                    <p className="text-sm text-gray-600">Delivery Fee: ₹{formData.deliveryFee}</p>
                    <p className="text-sm text-gray-600">Rating: {formData.rating}</p>
                    {formData.website && (
                      <p className="text-sm text-gray-600">Website: {formData.website}</p>
                    )}
                    {formData.offers && (
                      <p className="text-sm text-gray-600">Offers: {formData.offers}</p>
                    )}
                    {formData.description && (
                      <p className="text-sm text-gray-600">Description: {formData.description.substring(0, 100)}...</p>
                    )}
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">Agreement</h3>
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        required
                        className="h-4 w-4 text-yellow-600 border-gray-300 rounded mt-1 mr-2"
                      />
                      <span className="text-sm text-gray-600">
                        I declare that all information provided is true and accurate. I agree to the terms and conditions of Koodai Platform.
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {currentSection > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Back
                </button>
              )}

              {currentSection < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition ml-auto"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </form>
        ) : (
          /* Success Message */
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-4">
              Your vendor application has been received. <br />Our admin team will review it and contact you within 2-3 business days.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto mb-6">
              <p className="text-sm font-medium text-gray-800 mb-1">Application Number</p>
              <p className="text-lg font-bold text-yellow-600">{applicationNumber}</p>
              <p className="text-sm text-yellow-800 mt-1">
                Status: <span className="font-medium text-yellow-600">Pending Review</span>
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Next Steps:</span>
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You will receive an email confirmation
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Admin will review your documents
                </li>
                <li className="flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  You will be notified once approved
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Submit Another Application
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Print Application
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestForm;