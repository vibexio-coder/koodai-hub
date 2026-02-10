
import React from 'react';
import { Search } from 'lucide-react';

const ProductFilters = ({
    filters,
    setFilters,
    categoryFilters,
    setCategoryFilters,
    vendorInfo
}) => {

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

    return (
        <>
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
        </>
    );
};

export default ProductFilters;
