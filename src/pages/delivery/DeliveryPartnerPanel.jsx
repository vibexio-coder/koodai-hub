import { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase.config';
import { collectionGroup, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Hardcoded for testing — Sam's delivery partner ID
const PARTNER_ID = 'CHE-DP-0002';
const PARTNER_NAME = 'Sam';

// Delivery status label helper
const DeliveryStatusBadge = ({ status }) => {
    const styles = {
        pending_acceptance: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        accepted: 'bg-blue-100 text-blue-800 border-blue-200',
        picked_up: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        declined: 'bg-red-100 text-red-800 border-red-200',
    };
    const labels = {
        pending_acceptance: '🟡 Awaiting Response',
        accepted: '🔵 Accepted',
        picked_up: '🚚 Picked Up',
        delivered: '✅ Delivered',
        declined: '🔴 Declined',
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {labels[status] || status}
        </span>
    );
};

export default function DeliveryPartnerPanel() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Listen for all storeOrders assigned to Sam that are active
        const q = query(
            collectionGroup(db, 'storeOrders'),
            where('delivery.partnerId', '==', PARTNER_ID),
            where('delivery.status', 'in', ['pending_acceptance', 'accepted', 'picked_up'])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                return {
                    storeOrderPath: docSnap.ref.path,
                    storeOrderId: docSnap.id,
                    orderId: docSnap.ref.parent?.parent?.id || '—',
                    customerName: data.customerName || data.userName || 'Customer',
                    deliveryAddress: data.deliveryAddress || data.address || '—',
                    storeTotal: data.storeTotal || 0,
                    deliveryStatus: data.delivery?.status || 'pending_acceptance',
                    storeStatus: data.storeStatus,
                    storeName: data.storeName || '—',
                };
            });
            setOrders(ordersData);
            setLoading(false);
        }, (err) => {
            console.error('Delivery listener error:', err);
            // Firestore composite index error — show a helpful message
            toast.error('Index error: ' + err.message + '. Check console for index creation link.');
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateDeliveryStatus = async (storeOrderPath, newStatus) => {
        try {
            const ref = doc(db, storeOrderPath);
            // Delivery partner ONLY writes delivery.status — vendor panel handles storeStatus sync
            await updateDoc(ref, { 'delivery.status': newStatus });
            toast.success(`Status updated to: ${newStatus.replace('_', ' ')}`);
        } catch (err) {
            console.error('Error updating delivery status:', err);
            toast.error('Failed to update status');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
                    <div className="bg-blue-100 rounded-full p-2">
                        <span className="text-2xl">🚚</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">{PARTNER_NAME}'s Delivery Panel</h1>
                        <p className="text-xs text-gray-500">ID: {PARTNER_ID}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

                {orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-gray-600 font-medium">No active delivery requests</p>
                        <p className="text-gray-400 text-sm mt-1">New orders will appear here in real-time</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.storeOrderPath} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">Order #{order.orderId.slice(0, 8).toUpperCase()}</p>
                                    <p className="text-xs text-gray-500">{order.storeName}</p>
                                </div>
                                <DeliveryStatusBadge status={order.deliveryStatus} />
                            </div>

                            {/* Order Details */}
                            <div className="px-5 py-4 space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-gray-400">👤</span>
                                    <span>{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="text-gray-400">📍</span>
                                    <span>{order.deliveryAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <span className="text-gray-400">💰</span>
                                    <span>₹{order.storeTotal}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="border-t border-gray-100 px-5 py-3 flex gap-2">

                                {/* pending_acceptance: Accept or Decline */}
                                {order.deliveryStatus === 'pending_acceptance' && (
                                    <>
                                        <button
                                            onClick={() => updateDeliveryStatus(order.storeOrderPath, 'declined')}
                                            className="flex-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            onClick={() => updateDeliveryStatus(order.storeOrderPath, 'accepted')}
                                            className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                        >
                                            Accept Delivery
                                        </button>
                                    </>
                                )}

                                {/* accepted: Mark Picked Up */}
                                {order.deliveryStatus === 'accepted' && (
                                    <button
                                        onClick={() => updateDeliveryStatus(order.storeOrderPath, 'picked_up')}
                                        className="flex-1 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                                    >
                                        🚚 Mark Picked Up
                                    </button>
                                )}

                                {/* picked_up: Mark Delivered */}
                                {order.deliveryStatus === 'picked_up' && (
                                    <button
                                        onClick={() => updateDeliveryStatus(order.storeOrderPath, 'delivered')}
                                        className="flex-1 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                    >
                                        ✅ Mark Delivered
                                    </button>
                                )}

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
