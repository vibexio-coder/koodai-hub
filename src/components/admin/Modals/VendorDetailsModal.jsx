
import React from 'react';
import ReactDOM from 'react-dom';
import { XCircle, Mail, Phone, MapPin, Globe, Store, Image, DollarSign, CheckCircle } from 'lucide-react';

const VendorDetailsModal = ({
    showVendorDetailsModal,
    selectedVendorDetails,
    setShowVendorDetailsModal,
    setSelectedVendorDetails,
    handleEditVendor,
    handleDeleteVendor
}) => {
    if (!showVendorDetailsModal || !selectedVendorDetails) return null;

    const vendor = selectedVendorDetails;

    // Helper to render boolean as Yes/No badges
    const BooleanBadge = ({ value, trueText = 'Yes', falseText = 'No' }) => (
        <span className={`px-2 py-1 text-xs rounded-full ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {value ? trueText : falseText}
        </span>
    );

    // Section Header Component
    const SectionHeader = ({ title, icon: Icon }) => (
        <div className="flex items-center gap-2 mb-4 border-b pb-2">
            {Icon && <Icon className="w-5 h-5 text-gray-500" />}
            <h4 className="font-semibold text-gray-800">{title}</h4>
        </div>
    );

    // Grid Item Component
    const InfoItem = ({ label, value, fullWidth = false }) => (
        <div className={fullWidth ? "col-span-full" : ""}>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-medium text-gray-900 break-words">{value !== undefined && value !== null && value !== '' ? value : 'N/A'}</p>
        </div>
    );

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Vendor Details</h3>
                            <p className="text-sm text-gray-500">ID: {vendor.applicationId}</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowVendorDetailsModal(false);
                                setSelectedVendorDetails(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XCircle className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* 1. KEY STATUS & BASIC INFO */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="h-32 w-32 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border border-gray-300">
                                    {vendor.image ? (
                                        <img src={vendor.image} alt={vendor.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Store className="h-12 w-12 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{vendor.name}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${vendor.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    vendor.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {vendor.status.toUpperCase()}
                                                </span>
                                                <span className="text-sm text-gray-500">• {vendor.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm bg-white p-3 rounded-lg border border-gray-100">
                                        <InfoItem label="Owner Name" value={vendor.ownerName} />
                                        <InfoItem label="Business Type" value={vendor.businessType} />
                                        <InfoItem label="Application ID" value={vendor.applicationId} />
                                        <InfoItem label="Registered On" value={vendor.registrationDate} />
                                    </div>

                                    {vendor.rejectionReason && (
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-700">
                                            <span className="font-semibold">Rejection Reason:</span> {vendor.rejectionReason}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 2. CONTACT & LOCATION */}
                        <div>
                            <SectionHeader title="Contact & Location" icon={MapPin} />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <InfoItem label="Email" value={vendor.email} />
                                    <InfoItem label="Phone" value={vendor.phone} />
                                    <InfoItem label="Website" value={vendor.website} />
                                </div>
                                <div className="space-y-4 md:col-span-2">
                                    <InfoItem label="Full Address" value={vendor.address} fullWidth />
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <InfoItem label="Operating City" value={vendor.operatingCity} />
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-500">Opening Hours</p>
                                            <div className="flex items-center gap-2">
                                                {vendor.is24x7 ? (
                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">24x7 Open</span>
                                                ) : (
                                                    <span className="font-medium text-gray-900">
                                                        {vendor.openingTime || 'N/A'} - {vendor.closingTime || 'N/A'}
                                                    </span>
                                                )}
                                                <BooleanBadge value={vendor.open} trueText="Currently Open" falseText="Closed Now" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. CATEGORY & FLAGS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <SectionHeader title="Category Specifics" icon={Store} />
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem label="Main Category" value={vendor.categoryName} />
                                        <InfoItem label="Sub-Category ID" value={vendor.categoryId} />
                                    </div>

                                    {/* Conditional Logic for Category Types */}
                                    <div className="pt-2 border-t border-gray-200 grid grid-cols-2 gap-4">
                                        {vendor.medicineType && <InfoItem label="Medicine Type" value={vendor.medicineType} />}
                                        {vendor.groceryType && <InfoItem label="Grocery Type" value={vendor.groceryType} />}
                                        {vendor.fruitsType && <InfoItem label="Fruit Type" value={vendor.fruitsType} />}
                                        {vendor.meatType && <InfoItem label="Meat Type" value={vendor.meatType} />}

                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-500">Vegetarian Only?</span>
                                            <div><BooleanBadge value={vendor.isVeg} /></div>
                                        </div>
                                        {vendor.category === 'Medicine' && (
                                            <>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-gray-500">Requires Prescription?</span>
                                                    <div><BooleanBadge value={vendor.requiresPrescription} /></div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm text-gray-500">Is Generic?</span>
                                                    <div><BooleanBadge value={vendor.generic} /></div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <SectionHeader title="Offers & Highlights" icon={Globe} />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Discounted</span>
                                        <BooleanBadge value={vendor.discounted} />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Best Seller</span>
                                        <BooleanBadge value={vendor.bestSeller} />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Featured</span>
                                        <BooleanBadge value={vendor.featured} />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">New Arrivals</span>
                                        <BooleanBadge value={vendor.newArrivals} />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Seasonal</span>
                                        <BooleanBadge value={vendor.seasonal} />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Organic</span>
                                        <BooleanBadge value={vendor.organic} />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <span className="text-sm text-gray-600">Hygiene Pass</span>
                                        <BooleanBadge value={vendor.hygienePass} trueText="Passed" falseText="Failed" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <InfoItem label="Current Offer Text" value={vendor.offers} fullWidth />
                                </div>
                            </div>
                        </div>

                        {/* 4. DELIVERY & SERVICE */}
                        <div>
                            <SectionHeader title="Delivery & Service" icon={Store} />
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <InfoItem label="Delivery Time" value={vendor.deliveryTime} />
                                <InfoItem label="Avg Prep Time" value={vendor.avgPreparationTime} />
                                <InfoItem label="Delivery Fee" value={`₹${vendor.deliveryFee}`} />
                                <InfoItem label="Min Order Value" value={`₹${vendor.minOrder}`} />
                                <InfoItem label="Commission Rate" value={`${vendor.commissionRate}%`} />
                                <InfoItem label="Delivery Radius" value={`${vendor.deliveryRadius} km`} />
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-500">Delivery Available?</span>
                                    <div><BooleanBadge value={vendor.deliveryAvailable} /></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm text-gray-500">Fast Delivery?</span>
                                    <div><BooleanBadge value={vendor.fastDelivery} /></div>
                                </div>
                            </div>
                        </div>

                        {/* 5. BANK & VERIFICATION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <SectionHeader title="Bank Details" icon={DollarSign} />
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <InfoItem label="Account Holder" value={vendor.accountHolderName} />
                                    <InfoItem label="Bank Name" value={vendor.bankName} />
                                    <InfoItem label="Account Number" value={vendor.accountNumber} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem label="IFSC Code" value={vendor.ifscCode} />
                                        <InfoItem label="UPI ID" value={vendor.upiId} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <SectionHeader title="Legal & Documents" icon={CheckCircle} />
                                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem label="Govt ID Type" value={vendor.governmentIdType} />
                                        <InfoItem label="Govt ID Number" value={vendor.governmentIdNumber} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem label="License Type" value={vendor.licenseType} />
                                        <InfoItem label="License Number" value={vendor.licenseNumber} />
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <InfoItem label="Registered Address" value={vendor.registeredAddress} fullWidth />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6. RAW FILTERS & METADATA */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-1">
                                <SectionHeader title="License Image" icon={Image} />
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono">
                                    {Object.entries(vendor.filters || {}).map(([key, value]) => (
                                        <div key={key} className="flex justify-between py-1 border-b border-gray-800 last:border-0">
                                            <span className="text-gray-400">{key}:</span>
                                            <span className={value ? 'text-green-400' : 'text-red-400'}>{String(value)}</span>
                                        </div>
                                    ))}
                                    {Object.keys(vendor.filters || {}).length === 0 && (
                                        <span className="text-gray-500 italic">No filters active</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                            <button
                                onClick={() => {
                                    setShowVendorDetailsModal(false);
                                    handleEditVendor(vendor);
                                }}
                                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition shadow-sm font-medium"
                            >
                                Edit Vendor
                            </button>
                            <button
                                onClick={() => {
                                    setShowVendorDetailsModal(false);
                                    if (window.confirm(`Are you sure you want to delete ${vendor.name}?`)) {
                                        handleDeleteVendor(vendor.id);
                                    }
                                }}
                                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm font-medium"
                            >
                                Delete Vendor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        , document.body);
};

export default VendorDetailsModal;
