
import React from 'react';
import { MoreVertical } from 'lucide-react';

const OrdersSection = ({ recentOrders, handleViewOrderDetails }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Order Management</h3>
                        <p className="text-sm text-gray-500">Monitor and control orders</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <input
                            type="text"
                            placeholder="Search Order ID..."
                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition">
                            Export Orders
                        </button>
                    </div>
                </div>
            </div>

            {/* Order Stats */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-gray-200">
                {[
                    { label: 'Total Orders', value: recentOrders.length, color: 'bg-blue-500' },
                    { label: 'Pending', value: recentOrders.filter(o => o.status === 'placed' || o.status === 'preparing').length, color: 'bg-yellow-500' },
                    { label: 'Delivered', value: recentOrders.filter(o => o.status === 'delivered').length, color: 'bg-green-500' },
                    { label: 'Cancelled', value: recentOrders.filter(o => o.status === 'cancelled').length, color: 'bg-red-500' },
                ].map((stat, index) => (
                    <div key={index} className="text-center">
                        <div className={`h-1 ${stat.color} rounded-full mb-2`}></div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Order Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {recentOrders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            recentOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.user}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{order.vendor}</td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                                order.status === 'placed' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                            Paid
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleViewOrderDetails(order)}
                                                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
                                            >
                                                View
                                            </button>
                                            <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersSection;
