
import React from 'react';
import { XCircle } from 'lucide-react';
import BusinessSpecificFields from './BusinessSpecificFields';

const EditVendorModal = ({
    showEditVendorModal,
    setShowEditVendorModal,
    editingVendor,
    setEditingVendor,
    categories,
    handleUpdateVendor,
    loading
}) => {
    if (!showEditVendorModal || !editingVendor) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Edit Business: {editingVendor.name}</h3>
                        <button
                            onClick={() => {
                                setShowEditVendorModal(false);
                                setEditingVendor(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <XCircle className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                <input
                                    type="text"
                                    value={editingVendor.name}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="Enter business name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={editingVendor.email}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, email: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="business@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    value={editingVendor.phone}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, phone: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={editingVendor.categoryId}
                                    onChange={(e) => {
                                        const selectedCat = categories.find(cat => cat.id === e.target.value);
                                        setEditingVendor({
                                            ...editingVendor,
                                            categoryId: e.target.value,
                                            categoryName: selectedCat ? selectedCat.name : '',
                                            cuisine: 'South Indian',
                                            priceRange: '₹₹',
                                            medicineType: 'Pharmacy',
                                            groceryType: 'Supermarket',
                                            fruitsType: 'Fruits Store',
                                            meatType: 'Meat Shop',
                                            dressType: 'Clothing Store',
                                        });
                                    }}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={editingVendor.description}
                                onChange={(e) => setEditingVendor({ ...editingVendor, description: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                rows="2"
                                placeholder="Brief description about the business"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <textarea
                                value={editingVendor.address}
                                onChange={(e) => setEditingVendor({ ...editingVendor, address: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                rows="2"
                                placeholder="Full address with city and pincode"
                            />
                        </div>

                        {/* Business Specific Fields */}
                        {editingVendor.categoryId && (
                            <BusinessSpecificFields
                                categoryName={categories.find(c => c.id === editingVendor.categoryId)?.name || editingVendor.categoryName}
                                formData={editingVendor}
                                setFormData={setEditingVendor}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                                <select
                                    value={editingVendor.businessType}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, businessType: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                >
                                    <option value="restaurant">Restaurant</option>
                                    <option value="store">Store</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <input
                                    type="number"
                                    value={editingVendor.rating}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, rating: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    placeholder="4.5"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                                <input
                                    type="text"
                                    value={editingVendor.deliveryTime}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, deliveryTime: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="30-40 min"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                                <input
                                    type="number"
                                    value={editingVendor.deliveryFee}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, deliveryFee: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="40"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                                <input
                                    type="number"
                                    value={editingVendor.minOrder}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, minOrder: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="150"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
                                <input
                                    type="number"
                                    value={editingVendor.commissionRate}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, commissionRate: parseInt(e.target.value) })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    min="0"
                                    max="50"
                                    placeholder="15"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                                <input
                                    type="number"
                                    value={editingVendor.deliveryRadius}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, deliveryRadius: parseInt(e.target.value) })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    min="1"
                                    max="20"
                                    placeholder="5"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <input
                                type="text"
                                value={editingVendor.image}
                                onChange={(e) => setEditingVendor({ ...editingVendor, image: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Offers</label>
                            <input
                                type="text"
                                value={editingVendor.offers}
                                onChange={(e) => setEditingVendor({ ...editingVendor, offers: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                placeholder="20% OFF on first order, Free delivery above ₹300"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={editingVendor.status}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, status: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                                <input
                                    type="text"
                                    value={editingVendor.website}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, website: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="https://business.com"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl flex-1">
                                <input
                                    type="checkbox"
                                    id="editOpen"
                                    checked={editingVendor.open}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, open: e.target.checked })}
                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <label htmlFor="editOpen" className="text-sm font-medium text-gray-700">
                                    Open for Business
                                </label>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl flex-1">
                                <input
                                    type="checkbox"
                                    id="editFeatured"
                                    checked={editingVendor.featured}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, featured: e.target.checked })}
                                    className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                                />
                                <label htmlFor="editFeatured" className="text-sm font-medium text-gray-700">
                                    Featured Business
                                </label>
                            </div>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl flex-1">
                                <input
                                    type="checkbox"
                                    id="editHygienePass"
                                    checked={editingVendor.hygienePass}
                                    onChange={(e) => setEditingVendor({ ...editingVendor, hygienePass: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="editHygienePass" className="text-sm font-medium text-gray-700">
                                    Hygiene Pass
                                </label>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <button
                                onClick={handleUpdateVendor}
                                disabled={loading || !editingVendor.name || !editingVendor.email || !editingVendor.phone || !editingVendor.categoryId}
                                className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Updating Business...' : 'Update Business'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditVendorModal;
