import React from 'react';
import { Eye, XCircle, MoreVertical } from 'lucide-react';

const VendorManagement = () => {
  const vendors = [
    { name: 'Fresh Groceries', email: 'fresh@email.com', mobile: '9876543210', type: 'Grocery', status: 'approved', date: '2024-01-10' },
    { name: 'Medi Pharma', email: 'medi@email.com', mobile: '9876543211', type: 'Pharmacy', status: 'approved', date: '2024-01-09' },
    { name: 'Food Palace', email: 'food@email.com', mobile: '9876543212', type: 'Food', status: 'pending', date: '2024-01-08' },
    { name: 'Meat Masters', email: 'meat@email.com', mobile: '9876543213', type: 'Meat', status: 'rejected', date: '2024-01-07' },
    { name: 'Quick Mart', email: 'quick@email.com', mobile: '9876543214', type: 'Grocery', status: 'suspended', date: '2024-01-06' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Vendor Management</h3>
            <p className="text-sm text-gray-500">Approve and manage vendors</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition">
              Export
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition">
              Add Vendor
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Suspended</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
            <option>All Categories</option>
            <option>Grocery</option>
            <option>Food</option>
            <option>Pharmacy</option>
            <option>Meat</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Vendor Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {vendors.map((vendor, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{vendor.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{vendor.email}</div>
                  <div className="text-sm text-gray-500">{vendor.mobile}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                    {vendor.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                    vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    vendor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{vendor.date}</td>
                <td className="px-6 py-4">
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
                    <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorManagement;