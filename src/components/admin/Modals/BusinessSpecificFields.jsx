
import React from 'react';

const BusinessSpecificFields = ({ categoryName, formData, setFormData }) => {

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

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
                                value={formData.cuisine}
                                onChange={(e) => handleChange('cuisine', e.target.value)}
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
                                value={formData.priceRange}
                                onChange={(e) => handleChange('priceRange', e.target.value)}
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
                                checked={formData.isVeg}
                                onChange={(e) => handleChange('isVeg', e.target.checked)}
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
                                value={formData.medicineType}
                                onChange={(e) => handleChange('medicineType', e.target.value)}
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
                                value={formData.groceryType}
                                onChange={(e) => handleChange('groceryType', e.target.value)}
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
                                value={formData.fruitsType}
                                onChange={(e) => handleChange('fruitsType', e.target.value)}
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
                                value={formData.meatType}
                                onChange={(e) => handleChange('meatType', e.target.value)}
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
                                value={formData.dressType}
                                onChange={(e) => handleChange('dressType', e.target.value)}
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
                                value={formData.priceRange}
                                onChange={(e) => handleChange('priceRange', e.target.value)}
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

export default BusinessSpecificFields;
