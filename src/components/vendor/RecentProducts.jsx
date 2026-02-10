
import React from 'react';
import { Package } from 'lucide-react';

const RecentProducts = ({ products, loading, setActiveTab }) => {
    return (
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
    );
};

export default RecentProducts;
