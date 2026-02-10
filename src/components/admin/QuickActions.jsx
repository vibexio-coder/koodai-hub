
import React from 'react';
import { Store, Folder, Users, Download } from 'lucide-react';

const QuickActions = ({ setShowAddVendorModal, setShowAddCategoryModal, setActiveTab, partners }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                    onClick={() => setShowAddVendorModal(true)}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <Store className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Add Business</span>
                </button>
                <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2">
                        <Folder className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Add Category</span>
                </button>
                <button
                    onClick={() => setActiveTab('partners')}
                    className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                    <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">View Partners ({partners.length})</span>
                </button>
                <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-2">
                        <Download className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Reports</span>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
