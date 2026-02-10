
import React from 'react';
import { Plus, Eye, Edit, Trash2, XCircle } from 'lucide-react';

const VendorsSection = ({
    vendorsLoading,
    filteredVendors,
    allVendors,
    filters,
    handleFilterChange,
    categories,
    setShowAddVendorModal,
    handleViewVendorDetails,
    handleEditVendor,
    handleDeleteVendor,
    handleApproveVendor,
    setRejectionVendorId,
    setShowRejectionModal,
    handleDeactivateVendor
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Business Management</h3>
                        <p className="text-sm text-gray-500">Approve and manage businesses</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition">
                            Export
                        </button>
                        <button
                            onClick={() => setShowAddVendorModal(true)}
                            className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Business
                        </button>
                    </div>
                </div>

                {/* Enhanced Filters */}
                <div className="flex items-center space-x-4 mt-4 flex-wrap gap-2">
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="suspended">Suspended</option>
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        value={filters.businessType}
                        onChange={(e) => handleFilterChange('businessType', e.target.value)}
                    >
                        <option value="all">All Business Types</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="store">Store</option>
                    </select>


                    <button
                        onClick={() => handleFilterChange('clear')}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Vendor Table */}
            <div className="overflow-x-auto">
                {vendorsLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading businesses...</p>
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
                            Showing {filteredVendors.length} of {allVendors.length} businesses
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Application</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category / Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredVendors.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No businesses found matching your filters
                                        </td>
                                    </tr>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{vendor.applicationId || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{vendor.name}</div>
                                                <div className="text-xs text-gray-500">{vendor.businessType === 'restaurant' ? 'Restaurant' : 'Store'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{vendor.email}</div>
                                                <div className="text-sm text-gray-500">{vendor.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                                        {vendor.category}
                                                    </span>
                                                    {vendor.cuisine && (
                                                        <div className="text-xs text-gray-500">Cuisine: {vendor.cuisine}</div>
                                                    )}
                                                    {vendor.medicineType && (
                                                        <div className="text-xs text-gray-500">Type: {vendor.medicineType}</div>
                                                    )}
                                                    {vendor.groceryType && (
                                                        <div className="text-xs text-gray-500">Type: {vendor.groceryType}</div>
                                                    )}
                                                    {vendor.fruitsType && (
                                                        <div className="text-xs text-gray-500">Type: {vendor.fruitsType}</div>
                                                    )}
                                                    {vendor.meatType && (
                                                        <div className="text-xs text-gray-500">Type: {vendor.meatType}</div>
                                                    )}
                                                    {vendor.dressType && (
                                                        <div className="text-xs text-gray-500">Type: {vendor.dressType}</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        vendor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {vendor.status}
                                                </span>
                                                {vendor.open === false && (
                                                    <span className="ml-1 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                                        Closed
                                                    </span>
                                                )}
                                                {vendor.featured && (
                                                    <span className="ml-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                                                        Featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {vendor.registrationDate}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewVendorDetails(vendor)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditVendor(vendor)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteVendor(vendor.id)}
                                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    {vendor.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApproveVendor(vendor.id)}
                                                                className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setRejectionVendorId(vendor.id);
                                                                    setShowRejectionModal(true);
                                                                }}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {vendor.status === 'approved' && (
                                                        <button
                                                            onClick={() => handleDeactivateVendor(vendor.id, vendor.status)}
                                                            className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-lg hover:bg-yellow-600"
                                                        >
                                                            Deactivate
                                                        </button>
                                                    )}
                                                    {vendor.status === 'suspended' && (
                                                        <button
                                                            onClick={() => handleDeactivateVendor(vendor.id, vendor.status)}
                                                            className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg hover:bg-green-600"
                                                        >
                                                            Activate
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </div>
    );
};

export default VendorsSection;
