
import React from 'react';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';

const PartnersSection = ({
    partnersLoading,
    partners,
    filteredPartners,
    filters,
    handleFilterChange,
    handleViewPartnerDetails,
    handleApprovePartner,
    handleRejectPartner
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">Partner Management</h3>
                        <p className="text-sm text-gray-500">Manage delivery partners and affiliates</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition">
                            Export
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex items-center space-x-4 mt-4 flex-wrap gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search partners by name, phone, or ID..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="pending_verification">Pending Verification</option>
                    </select>

                    <button
                        onClick={() => handleFilterChange('clear')}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Partners Table */}
            <div className="overflow-x-auto">
                {partnersLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                        <p className="text-gray-500 mt-4">Loading partners...</p>
                    </div>
                ) : (
                    <>
                        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
                            Showing {filteredPartners.length} of {partners.length} partners
                        </div>
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPartners.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No partners found matching your filters
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPartners.map((partner) => (
                                        <tr key={partner.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900 text-xs font-mono">{partner.id.substring(0, 8)}...</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{partner.basicInfo?.name || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{partner.basicInfo?.phone || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs bg-blue-50 text-blue-800 rounded-full">
                                                    {partner.vehicle?.vehicleType || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${partner.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    partner.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {partner.status?.replace('_', ' ') || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {partner.registrationDate || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleViewPartnerDetails(partner)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>

                                                    {partner.status === 'pending_verification' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprovePartner(partner.id)}
                                                                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                                                title="Approve"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectPartner(partner.id)}
                                                                className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                                                title="Reject"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
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

export default PartnersSection;
