
import React from 'react';
import { Package, Check, X, DollarSign } from 'lucide-react';

const VendorStats = ({ stats }) => {
    return (
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
    );
};

export default VendorStats;
