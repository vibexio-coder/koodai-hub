
import React from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const CategoriesSection = ({
    categories,
    allVendors,
    setShowAddCategoryModal,
    handleUpdateCategoryStatus,
    handleDeleteCategory,
    loading
}) => {
    return (
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
    );
};

export default CategoriesSection;
