import React from 'react';
import { 
  Users, Store, CheckCircle, Clock, 
  ShoppingBag, DollarSign, Eye, XCircle,
  Filter, Download, Folder, TrendingUp
} from 'lucide-react';
import StatsCard from './StatsCard';

const Overview = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: <Users className="w-6 h-6" />, color: 'bg-blue-500', change: '+12%' },
    { title: 'Total Vendors', value: '89', icon: <Store className="w-6 h-6" />, color: 'bg-green-500', change: '+5%' },
    { title: 'Active Vendors', value: '67', icon: <CheckCircle className="w-6 h-6" />, color: 'bg-emerald-500', change: '+3%' },
    { title: 'Pending Requests', value: '22', icon: <Clock className="w-6 h-6" />, color: 'bg-yellow-500', change: '+2' },
    { title: "Today's Orders", value: '156', icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-purple-500', change: '+8%' },
    { title: 'Total Revenue', value: '₹45,280', icon: <DollarSign className="w-6 h-6" />, color: 'bg-indigo-500', change: '+15%' },
  ];

  const pendingVendors = [
    { id: 1, name: 'Fresh Groceries', email: 'fresh@email.com', mobile: '9876543210', type: 'Grocery', date: '2024-01-15', status: 'pending' },
    { id: 2, name: 'Medi Pharma', email: 'medi@email.com', mobile: '9876543211', type: 'Pharmacy', date: '2024-01-14', status: 'pending' },
    { id: 3, name: 'Food Palace', email: 'food@email.com', mobile: '9876543212', type: 'Food', date: '2024-01-13', status: 'pending' },
    { id: 4, name: 'Meat Masters', email: 'meat@email.com', mobile: '9876543213', type: 'Meat', date: '2024-01-12', status: 'pending' },
  ];

  const recentOrders = [
    { id: 'ORD-1001', user: 'Raj Kumar', vendor: 'Fresh Groceries', amount: '₹850', status: 'delivered', time: '10:30 AM' },
    { id: 'ORD-1002', user: 'Priya Sharma', vendor: 'Medi Pharma', amount: '₹420', status: 'preparing', time: '11:15 AM' },
    { id: 'ORD-1003', user: 'Amit Patel', vendor: 'Food Palace', amount: '₹1,250', status: 'placed', time: '12:00 PM' },
    { id: 'ORD-1004', user: 'Sneha Reddy', vendor: 'Meat Masters', amount: '₹680', status: 'cancelled', time: '01:45 PM' },
  ];

  const quickActions = [
    { icon: <Store className="w-5 h-5" />, label: 'Add Vendor', color: 'bg-blue-100 text-blue-600' },
    { icon: <Folder className="w-5 h-5" />, label: 'Add Category', color: 'bg-green-100 text-green-600' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'View Orders', color: 'bg-purple-100 text-purple-600' },
    { icon: <Download className="w-5 h-5" />, label: 'Reports', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} stat={stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Vendor Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Pending Vendor Requests</h3>
              <p className="text-sm text-gray-500">Requires immediate attention</p>
            </div>
            <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {pendingVendors.map((vendor) => (
              <div key={vendor.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{vendor.name}</h4>
                  <p className="text-sm text-gray-600">{vendor.type} • {vendor.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600">
                    Approve
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
              <p className="text-sm text-gray-500">Latest customer orders</p>
            </div>
            <button className="flex items-center px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800">{order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.user} → {order.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">{order.amount}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button key={index} className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <div className={`w-10 h-10 ${action.color} rounded-full flex items-center justify-center mb-2`}>
                  {action.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;