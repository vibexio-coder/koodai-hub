
import React from 'react';
import { XCircle } from 'lucide-react';

const RejectionModal = ({
    showRejectionModal,
    setShowRejectionModal,
    rejectionReason,
    setRejectionReason,
    rejectionVendorId,
    setRejectionVendorId,
    handleRejectVendor
}) => {
    if (!showRejectionModal) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Reject Vendor</h3>
                        <button
                            onClick={() => {
                                setShowRejectionModal(false);
                                setRejectionReason('');
                                setRejectionVendorId(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <XCircle className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Please provide reason for rejection *
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                rows="4"
                                placeholder="Enter detailed reason for rejection..."
                                required
                            />
                        </div>

                        <div className="pt-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowRejectionModal(false);
                                    setRejectionReason('');
                                    setRejectionVendorId(null);
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRejectVendor(rejectionVendorId)}
                                disabled={!rejectionReason.trim()}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reject Vendor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RejectionModal;
