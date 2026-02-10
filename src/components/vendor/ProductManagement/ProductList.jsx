
import React from 'react';
import { Package, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

const ProductList = ({
    products,
    filteredProducts,
    loading,
    vendorInfo,
    viewMode,
    vendorInfo,
    viewMode,
    handleToggleStock,
    handleEditProduct,
    handleDeleteProduct,
    setShowProductModal
}) => {
    return (
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
            ) : viewMode === 'grid' ? (
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
    );
};

export default ProductList;
