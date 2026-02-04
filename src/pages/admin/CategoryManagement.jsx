import React from 'react';

const CategoryManagement = () => {
  const categories = [
    { name: 'Grocery', type: 'Grocery', vendors: 24, status: 'active' },
    { name: 'Food', type: 'Food', vendors: 18, status: 'active' },
    { name: 'Pharmacy', type: 'Pharmacy', vendors: 12, status: 'active' },
    { name: 'Meat', type: 'Meat', vendors: 8, status: 'inactive' },
    { name: 'Bakery', type: 'Food', vendors: 5, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-800">5</div>
          <div className="text-sm text-gray-500">Total Categories</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-800">4</div>
          <div className="text-sm text-gray-500">Active Categories</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-2xl font-bold text-gray-800">67</div>
          <div className="text-sm text-gray-500">Vendors by Category</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <button className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
            Add New Category
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Category Management</h3>
          <p className="text-sm text-gray-500">Control what vendors can sell</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {categories.map((category, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 transition">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">{category.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  category.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Type: {category.type}</div>
              <div className="text-sm text-gray-600 mb-4">Vendors: {category.vendors}</div>
              <div className="flex items-center space-x-2">
                <button className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Edit
                </button>
                <button className={`flex-1 py-2 text-sm rounded-lg ${
                  category.status === 'active' 
                    ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                    : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}>
                  {category.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;