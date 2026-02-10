
import React from 'react';

const PaymentsSection = ({ allVendors }) => {
    return (
        <div className="space-y-6">
            {/* Payment Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Revenue', value: `₹${allVendors.reduce((sum, v) => sum + (v.totalEarnings || 0), 0).toLocaleString()}`, color: 'bg-green-500' },
                    { label: 'Platform Commission', value: `₹${allVendors.reduce((sum, v) => sum + ((v.totalEarnings || 0) * ((v.commissionRate || 15) / 100)), 0).toLocaleString()}`, color: 'bg-blue-500' },
                    { label: 'Pending Payouts', value: '₹0', color: 'bg-yellow-500' },
                    { label: 'Completed Payouts', value: '₹0', color: 'bg-purple-500' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className={`h-1 ${stat.color} rounded-full mb-4`}></div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Payouts Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Business Payouts</h3>
                    <p className="text-sm text-gray-500">Handle money flow</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {allVendors.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                        No payout data available
                                    </td>
                                </tr>
                            ) : (
                                allVendors.slice(0, 5).map((vendor, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">₹{vendor.totalEarnings || 0}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800`}>
                                                Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">Bank Transfer</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">2024-01-20</td>
                                        <td className="px-6 py-4">
                                            {vendor.totalEarnings > 0 ? (
                                                <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600">
                                                    Release Payout
                                                </button>
                                            ) : (
                                                <span className="text-sm text-gray-500">No earnings</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PaymentsSection;
