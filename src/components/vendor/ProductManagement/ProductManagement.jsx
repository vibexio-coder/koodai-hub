
import React from 'react';
import { List, Grid, Plus } from 'lucide-react';
import ProductFilters from './ProductFilters';
import ProductList from './ProductList';

const ProductManagement = ({
    products,
    filteredProducts,
    loading,
    vendorInfo,
    stats,
    filters,
    setFilters,
    categoryFilters,
    setCategoryFilters,
    handleToggleAvailability,
    handleEditProduct,
    handleDeleteProduct,
    setShowProductModal
}) => {
    return (
        <div className="space-y-6">
            {/* Product Stats and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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

                        <ProductFilters
                            filters={filters}
                            setFilters={setFilters}
                            categoryFilters={categoryFilters}
                            setCategoryFilters={setCategoryFilters}
                            vendorInfo={vendorInfo}
                        />
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
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
            <ProductList
                products={products}
                filteredProducts={filteredProducts}
                loading={loading}
                vendorInfo={vendorInfo}
                viewMode={filters.viewMode}
                handleToggleAvailability={handleToggleAvailability}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
                setShowProductModal={setShowProductModal}
            />
        </div>
    );
};

export default ProductManagement;
