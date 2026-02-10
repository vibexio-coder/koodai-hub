
import React from 'react';
import { XCircle } from 'lucide-react';
import BusinessSpecificFields from './BusinessSpecificFields';

const AddVendorModal = ({
    showAddVendorModal,
    setShowAddVendorModal,
    newVendor,
    setNewVendor,
    categories,
    handleAddVendor,
    loading,
    resetVendorForm
}) => {
    if (!showAddVendorModal) return null;

    const handleFieldChange = (field, value) => {
        setNewVendor(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">Add New Business/Vendor</h3>
                        <button
                            onClick={() => {
                                setShowAddVendorModal(false);
                                resetVendorForm();
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
                                    value={newVendor.name}
                                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="Enter business name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={newVendor.email}
                                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
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
                                    value={newVendor.phone}
                                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={newVendor.categoryId}
                                    onChange={(e) => {
                                        const selectedCat = categories.find(cat => cat.id === e.target.value);
                                        setNewVendor({
                                            ...newVendor,
                                            categoryId: e.target.value,
                                            categoryName: selectedCat ? selectedCat.name : '',
                                            cuisine: 'South Indian',
                                            priceRange: '₹₹',
                                            medicineType: 'Pharmacy',
                                            groceryType: 'Supermarket',
                                            fruitsType: 'Fruits Store',
                                            meatType: 'Meat Shop',
                                            dressType: 'Clothing Store',
                                            isVeg: false,
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
                                value={newVendor.description}
                                onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                rows="2"
                                placeholder="Brief description about the business"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <textarea
                                value={newVendor.address}
                                onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                rows="2"
                                placeholder="Full address with city and pincode"
                            />
                        </div>

                        {/* Business Specific Fields */}
                        {newVendor.categoryId && (
                            <BusinessSpecificFields
                                categoryName={categories.find(c => c.id === newVendor.categoryId)?.name || newVendor.categoryName}
                                formData={newVendor}
                                setFormData={setNewVendor}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                                <select
                                    value={newVendor.businessType}
                                    onChange={(e) => setNewVendor({ ...newVendor, businessType: e.target.value })}
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
                                    value={newVendor.rating}
                                    onChange={(e) => setNewVendor({ ...newVendor, rating: e.target.value })}
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
                                    value={newVendor.deliveryTime}
                                    onChange={(e) => setNewVendor({ ...newVendor, deliveryTime: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="30-40 min"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (₹)</label>
                                <input
                                    type="number"
                                    value={newVendor.deliveryFee}
                                    onChange={(e) => setNewVendor({ ...newVendor, deliveryFee: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="40"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (₹)</label>
                                <input
                                    type="number"
                                    value={newVendor.minOrder}
                                    onChange={(e) => setNewVendor({ ...newVendor, minOrder: e.target.value })}
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
                                    value={newVendor.commissionRate}
                                    onChange={(e) => setNewVendor({ ...newVendor, commissionRate: parseInt(e.target.value) })}
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
                                    value={newVendor.deliveryRadius}
                                    onChange={(e) => setNewVendor({ ...newVendor, deliveryRadius: parseInt(e.target.value) })}
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
                                value={newVendor.image}
                                onChange={(e) => setNewVendor({ ...newVendor, image: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Offers</label>
                            <input
                                type="text"
                                value={newVendor.offers}
                                onChange={(e) => setNewVendor({ ...newVendor, offers: e.target.value })}
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                placeholder="20% OFF on first order, Free delivery above ₹300"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={newVendor.status}
                                    onChange={(e) => setNewVendor({ ...newVendor, status: e.target.value })}
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
                                    value={newVendor.website}
                                    onChange={(e) => setNewVendor({ ...newVendor, website: e.target.value })}
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    placeholder="https://business.com"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <button
                                onClick={handleAddVendor}
                                disabled={loading || !newVendor.name || !newVendor.email || !newVendor.phone || !newVendor.categoryId}
                                className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Adding Business...' : 'Add Business'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddVendorModal;
