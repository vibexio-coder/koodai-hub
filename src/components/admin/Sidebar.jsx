
import React from 'react';
import {
    MoreVertical,
    View,
    Store,
    Users,
    ShoppingBag,
    Folder,
    DollarSign,
    AlertCircle,
    Settings
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: <View className="w-5 h-5" /> },
        { id: 'vendors', label: 'Vendor Management', icon: <Store className="w-5 h-5" /> },
        { id: 'partners', label: 'Partner Management', icon: <Users className="w-5 h-5" /> },
        { id: 'orders', label: 'Order Management', icon: <ShoppingBag className="w-5 h-5" /> },
        { id: 'categories', label: 'Category Management', icon: <Folder className="w-5 h-5" /> },
        { id: 'payments', label: 'Payments', icon: <DollarSign className="w-5 h-5" /> },
        { id: 'users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
        { id: 'complaints', label: 'Complaints', icon: <AlertCircle className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300`}>
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    {sidebarOpen && (
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">KOODAI HUB</h1>
                            <p className="text-xs text-gray-500">Admin Panel</p>
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
            </nav>
        </div>
    );
};

export default Sidebar;
