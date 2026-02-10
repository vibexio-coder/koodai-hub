
import React from 'react';
import { XCircle } from 'lucide-react';

const AddCategoryModal = ({
    showAddCategoryModal,
    setShowAddCategoryModal,
    newCategory,
    setNewCategory,
    handleAddCategory,
    loading
}) => {
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

export default AddCategoryModal;
