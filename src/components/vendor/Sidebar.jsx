
import React from 'react';
import {
    Home,
    Package,
    ShoppingBag,
    TrendingUp,
    Settings,
    LogOut,
    MoreVertical
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, vendorInfo, handleLogout }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
        { id: 'products', label: 'Product List', icon: <Package className="w-5 h-5" /> },
        { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5" /> },
        { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">VENDOR PANEL</h1>
                            <p className="text-xs text-gray-500">{vendorInfo?.businessName}</p>
                        </div>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-lg hover:bg-gray-100"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <nav className="p-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 my-1 rounded-lg transition-colors ${activeTab === item.id
                                ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {item.icon}
                        {sidebarOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                    </button>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${sidebarOpen ? 'justify-start px-4' : 'justify-center'} py-3 text-red-600 hover:bg-red-50 rounded-lg`}
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
