import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Eye,
    MoreVertical,
    Calendar,
    ChevronDown,
    ChevronUp,
    Store,
    User
} from 'lucide-react';
import { db } from '../../firebase/firebase.config';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    getDocs,
    doc,
    collectionGroup
} from 'firebase/firestore';

const OrderManagement = ({ handleViewOrderDetails, allVendors }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [storeFilter, setStoreFilter] = useState('all');
    const [filteredOrders, setFilteredOrders] = useState([]);

    // Fetch orders using dual-stream strategy
    useEffect(() => {
        setLoading(true);

        // 1. Fetch all storeOrders (Vendor Orders) - robust source of truth for vendor items
        const storeOrdersQuery = query(collectionGroup(db, 'storeOrders'));

        // 2. Fetch all parent orders - for customer info & legacy support
        const parentOrdersQuery = query(collection(db, 'orders'));

        // Use onSnapshot for real-time updates on both
        const unsubscribeStore = onSnapshot(storeOrdersQuery, (storeSnap) => {
            const storeDocs = storeSnap.docs;

            // Nested listener for parents isn't ideal for perf, but ensuring we have up-to-date parents is key.
            // Better: Listen to both independently and merge in state or a reducer.
            // For simplicity/stability: We'll fetch parents once or listen to them too.
            // Let's listen to parents as well.
        });

        const unsubscribeParent = onSnapshot(parentOrdersQuery, (parentSnap) => {
            // trigger merge
        });

        // Actually, managing two async streams merging into one state can be tricky with race conditions.
        // Let's try a simpler approach: 
        // We'll define a function that processes both snapshots when they update.
        // But `onSnapshot` is event-driven.

        // Revised Approach:
        // Use a single variable to hold the unsubscribe for the combined logic? No.
        // Let's use two unsusbcribes.

        let storeDocsCache = [];
        let parentDocsCache = new Map();
        let isStoreLoaded = false;
        let isParentLoaded = false;

        const mergeAndSetOrders = () => {
            if (!isStoreLoaded || !isParentLoaded) return;

            const allRows = [];
            const handledParentIds = new Set();

            // 1. Process Store Orders
            storeDocsCache.forEach(storeDoc => {
                const storeData = storeDoc.data();
                // Valid storeOrder?
                if (!storeData) return;

                const parentId = storeDoc.ref.parent.parent ? storeDoc.ref.parent.parent.id : null;
                const parentOrder = (parentId && parentDocsCache.get(parentId)) || {};

                if (parentId) handledParentIds.add(parentId);

                allRows.push({
                    id: storeDoc.id,
                    parentId: parentId || 'orphan',
                    uniqueId: `${parentId || 'orphan'}_${storeDoc.id}`,
                    orderId: storeData.orderId || parentOrder.orderId || parentId,

                    // Store Order Specifics
                    storeId: storeData.storeId,
                    storeName: storeData.storeName || 'Unknown Store',
                    storeImage: storeData.storeImage,
                    vendorId: storeData.storeOwnerId,
                    amount: storeData.storeTotal || 0,
                    status: storeData.storeStatus || 'Pending',
                    items: storeData.items || [],

                    // Parent Order Details (Fallback to 'N/A' if parent missing)
                    customerId: parentOrder.userId,
                    userName: parentOrder.userName || parentOrder.customerName || 'N/A',
                    userPhone: parentOrder.userPhone || parentOrder.customerPhone || 'N/A',
                    userAddress: parentOrder.userAddress,
                    paymentMethod: parentOrder.paymentMethod || 'N/A',
                    createdAt: storeData.createdAt || parentOrder.createdAt,

                    // For Details Modal
                    vendorName: storeData.storeName || 'Unknown Store',
                    vendorAddress: storeData.storeAddress || '',

                    totalAmount: storeData.storeTotal || 0,
                    subtotal: storeData.storeSubtotal || 0,
                    deliveryFee: storeData.storeDeliveryFee || 0,
                    tax: storeData.storeTax || 0,

                    // Raw Data
                    ...storeData,
                    parentOrder: parentOrder
                });
            });

            // 2. Process Legacy Orders (Parents with no mapped storeOrders)
            parentDocsCache.forEach((parentOrder, parentId) => {
                if (!handledParentIds.has(parentId)) {
                    // This indicates either:
                    // a) It's a legacy order with no sub-collection
                    // b) It's a new order but storeOrders haven't synced/created yet

                    // We include it as a "Single Store" order
                    allRows.push({
                        id: parentId,
                        parentId: parentId,
                        uniqueId: parentId,
                        orderId: parentOrder.orderId || parentId,

                        storeId: parentOrder.restaurantId || 'N/A',
                        storeName: parentOrder.vendorName || parentOrder.businessName || 'Single Store',
                        vendorId: parentOrder.vendorId,
                        amount: parentOrder.totalAmount || parentOrder.amount || 0,
                        status: parentOrder.overallStatus || parentOrder.orderStatus || parentOrder.status || 'Pending',
                        items: parentOrder.items || [],

                        customerId: parentOrder.userId,
                        userName: parentOrder.userName || parentOrder.customerName || 'N/A',
                        userPhone: parentOrder.userPhone || parentOrder.customerPhone || 'N/A',
                        userAddress: parentOrder.userAddress,
                        paymentMethod: parentOrder.paymentMethod || 'N/A',
                        createdAt: parentOrder.createdAt,

                        vendorName: parentOrder.vendorName || parentOrder.businessName || 'Single Store',
                        vendorAddress: parentOrder.vendorAddress || '',

                        totalAmount: parentOrder.totalAmount || parentOrder.amount || 0,
                        subtotal: parentOrder.subtotal || 0,
                        deliveryFee: parentOrder.deliveryFee || 0,
                        tax: parentOrder.tax || 0,

                        ...parentOrder,
                        parentOrder: parentOrder
                    });
                }
            });

            // Sort
            allRows.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                return dateB - dateA;
            });

            setOrders(allRows);
            setLoading(false);
        };

        const u1 = onSnapshot(storeOrdersQuery, (snap) => {
            storeDocsCache = snap.docs;
            isStoreLoaded = true;
            mergeAndSetOrders();
        }, (error) => {
            console.error("Error fetching storeOrders:", error);
            // Don't block if one fails, maybe? But for now proceed.
            isStoreLoaded = true; // Pretend loaded to unblock
            mergeAndSetOrders();
        });

        const u2 = onSnapshot(parentOrdersQuery, (snap) => {
            const map = new Map();
            snap.docs.forEach(doc => map.set(doc.id, doc.data()));
            parentDocsCache = map;
            isParentLoaded = true;
            mergeAndSetOrders();
        }, (error) => {
            console.error("Error fetching parent orders:", error);
            isParentLoaded = true;
            mergeAndSetOrders();
        });

        return () => {
            u1();
            u2();
        };
    }, []);

    // Filter Logic
    useEffect(() => {
        let result = orders;

        // Search
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(order =>
                order.id.toLowerCase().includes(term) ||
                order.parentId.toLowerCase().includes(term) ||
                order.userName.toLowerCase().includes(term) ||
                order.userPhone.includes(term)
            );
        }

        // Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(order => order.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Store Filter
        if (storeFilter !== 'all') {
            result = result.filter(order => order.storeId === storeFilter || order.vendorId === storeFilter);
        }

        setFilteredOrders(result);
    }, [orders, searchTerm, statusFilter, storeFilter]);

    // Format Helpers
    const formatCurrency = (amount) => `₹${parseFloat(amount || 0).toFixed(2)}`;

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('en-IN', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        if (s === 'delivered') return 'bg-green-100 text-green-800';
        if (s === 'cancelled' || s === 'rejected') return 'bg-red-100 text-red-800';
        if (s === 'accepted' || s === 'preparing' || s === 'ready') return 'bg-blue-100 text-blue-800';
        return 'bg-yellow-100 text-yellow-800'; // Pending/Placed
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Header / Controls */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Order Management</h2>
                        <p className="text-sm text-gray-500">Monitor all orders across vendors</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Order ID / Customer..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none appearance-none bg-white cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Preparing">Preparing</option>
                                <option value="Ready">Ready</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Store Filter */}
                        <div className="relative">
                            <Store className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-yellow-500 outline-none appearance-none bg-white cursor-pointer max-w-[200px]"
                                value={storeFilter}
                                onChange={(e) => setStoreFilter(e.target.value)}
                            >
                                <option value="all">All Stores</option>
                                {allVendors && allVendors.map(vendor => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.name || vendor.businessName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order Info</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Amount</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            // Loading Skeleton
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24 mb-2"></div><div className="h-3 bg-gray-100 rounded w-16"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-100 rounded w-24"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                                    <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></td>
                                    <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div></td>
                                </tr>
                            ))
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order) => (
                                <tr key={order.uniqueId} className="hover:bg-gray-50 transition-colors">
                                    {/* Order Info */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">
                                            {order.orderId ? `#${order.orderId}` : `#${order.id.slice(-6).toUpperCase()}`}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </td>

                                    {/* Customer */}
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.userName}</div>
                                        <div className="text-xs text-gray-500 mt-1">{order.userPhone}</div>
                                    </td>

                                    {/* Store */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                <Store className="w-4 h-4" />
                                            </div>
                                            <div className="text-sm font-medium text-gray-700">{order.storeName}</div>
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-bold text-gray-900">{formatCurrency(order.amount)}</div>
                                        <div className="text-xs text-gray-500 mt-1">{order.paymentMethod}</div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>

                                    {/* Action */}
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleViewOrderDetails(order)}
                                            className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
                                            title="View Details"
                                        >
                                            <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Search className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No orders found</h3>
                                        <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination (Simple for now) */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
                <div>Showing {filteredOrders.length} orders</div>
                {/* Pagination controls can be added here if needed */}
            </div>
        </div>
    );
};

export default OrderManagement;
