
import React from 'react';
import { Filter } from 'lucide-react';

const RecentOrders = ({ recentOrders }) => {
    return (
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
                {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No recent orders
                    </div>
                ) : (
                    recentOrders.slice(0, 4).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                            <div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-medium text-gray-800">{order.id}</span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
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
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentOrders;
