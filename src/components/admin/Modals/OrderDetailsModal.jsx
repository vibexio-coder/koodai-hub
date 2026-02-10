
import React from 'react';
import { X, User, MapPin, Store, CreditCard, Clock, CheckCircle } from 'lucide-react';

const OrderDetailsModal = ({
    showOrderDetailsModal,
    setShowOrderDetailsModal,
    selectedOrderDetails,
    setSelectedOrderDetails
}) => {
    if (!showOrderDetailsModal || !selectedOrderDetails) return null;

    const order = selectedOrderDetails;

    // Helper to format currency
    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    // Helper to format date
    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        // Handle Firestore timestamp or standard date string
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'preparing': return 'bg-blue-100 text-blue-800';
            case 'placed': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold text-gray-800">Order #{order.id?.slice(-6).toUpperCase()}</h3>
                                <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(order.status)}`}>
                                    {order.status?.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowOrderDetailsModal(false);
                                setSelectedOrderDetails(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                                <User className="w-4 h-4 text-gray-500" /> Customer Details
                            </h4>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500 min-w-[80px] inline-block">Name:</span>
                                    <span className="font-medium">{order.userName || 'N/A'}</span>
                                </p>
                                <p><span className="text-gray-500 min-w-[80px] inline-block">Phone:</span>
                                    <span className="font-medium">{order.userPhone || 'N/A'}</span>
                                </p>
                                <div className="flex items-start gap-1">
                                    <span className="text-gray-500 min-w-[80px] inline-block shrink-0">Address:</span>
                                    <span className="font-medium">{order.userAddress ?
                                        `${order.userAddress.houseNumber || ''}, ${order.userAddress.area || ''}, ${order.userAddress.city || ''} - ${order.userAddress.pincode || ''}`
                                        : 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Vendor Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                                <Store className="w-4 h-4 text-gray-500" /> Business Details
                            </h4>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-500 min-w-[80px] inline-block">Name:</span>
                                    <span className="font-medium">{order.vendorName || 'N/A'}</span>
                                </p>
                                <p><span className="text-gray-500 min-w-[80px] inline-block">Vendor ID:</span>
                                    <span className="font-medium">{order.vendorId || 'N/A'}</span>
                                </p>
                                <p><span className="text-gray-500 min-w-[80px] inline-block">Address:</span>
                                    <span className="font-medium truncate block">{order.vendorAddress || 'N/A'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="border rounded-lg overflow-hidden mb-6">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3">Item</th>
                                    <th className="px-4 py-3 text-center">Unit Price</th>
                                    <th className="px-4 py-3 text-center">Qty</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{item.name}</div>
                                                {item.variant && <div className="text-xs text-gray-500">{item.variant}</div>}
                                            </td>
                                            <td className="px-4 py-3 text-center">{formatCurrency(item.price)}</td>
                                            <td className="px-4 py-3 text-center">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right font-medium">
                                                {formatCurrency(item.price * item.quantity)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No items found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Delivery Info */}
                        <div className="md:col-span-2 space-y-4">
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="flex items-center gap-2 font-semibold text-blue-800 mb-2 text-sm uppercase tracking-wide">
                                    <Clock className="w-4 h-4" /> Delivery Status
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-blue-600 text-xs">Partner Name</p>
                                        <p className="font-medium text-blue-900">{order.deliveryPartner?.name || 'Searching for partner...'}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-600 text-xs">Partner Phone</p>
                                        <p className="font-medium text-blue-900">{order.deliveryPartner?.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-blue-600 text-xs">Estimated Time</p>
                                        <p className="font-medium text-blue-900">{order.estimatedDeliveryTime || '30-45 mins'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="flex items-center gap-2 font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                                <CreditCard className="w-4 h-4 text-gray-500" /> Payment
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotal || 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>{formatCurrency(order.deliveryFee || 0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Tax & Charges</span>
                                    <span>{formatCurrency(order.tax || 0)}</span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-gray-800">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.totalAmount || order.amount || 0)}</span>
                                </div>
                                <div className="pt-2 text-right">
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                                        <CheckCircle className="w-3 h-3" />
                                        {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'PAID'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
