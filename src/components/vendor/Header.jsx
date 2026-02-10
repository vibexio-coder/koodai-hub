
import React from 'react';
import { Plus } from 'lucide-react';

const Header = ({ activeTab, vendorInfo, setShowProductModal }) => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 capitalize">
                        {activeTab === 'products' ? 'Product Management' :
                            activeTab === 'orders' ? 'Order Management' :
                                activeTab === 'analytics' ? 'Analytics' :
                                    activeTab === 'settings' ? 'Settings' : 'Dashboard'}
                    </h2>
                    <p className="text-sm text-gray-500">
                        {vendorInfo?.categoryName} • {vendorInfo?.businessName}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setShowProductModal(true)}
                        className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                    <div className="text-sm text-gray-600">
                        Application ID: <span className="font-semibold">{vendorInfo?.applicationId}</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <span className="text-yellow-700 font-semibold">V</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
