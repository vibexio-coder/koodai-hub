import React from 'react';
import ReactDOM from 'react-dom';
import { XCircle, Mail, Phone, MapPin, User, FileText, Truck, CreditCard, Shield, Camera, Map, Bell } from 'lucide-react';

const PartnerDetailsModal = ({
    showPartnerDetailsModal,
    selectedPartnerDetails,
    setShowPartnerDetailsModal,
    setSelectedPartnerDetails,
    handleApprovePartner,
    handleRejectPartner
}) => {
    if (!showPartnerDetailsModal || !selectedPartnerDetails) return null;

    const partner = selectedPartnerDetails;

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

    // Helper to check multiple keys for data
    const getFlexValue = (obj, keysArray) => {
        if (!obj) return undefined;
        for (const key of keysArray) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                return obj[key];
            }
        }
        return undefined;
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 border-b pb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Partner Details</h3>
                            <p className="text-sm text-gray-500">ID: {partner.id}</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowPartnerDetailsModal(false);
                                setSelectedPartnerDetails(null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XCircle className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* 1. BASIC INFO & STATUS */}
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="h-32 w-32 rounded-xl bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border border-gray-300">
                                    {getFlexValue(partner.basicInfo, ['profileImage', 'image', 'profile_image']) ? (
                                        <img src={getFlexValue(partner.basicInfo, ['profileImage', 'image', 'profile_image'])} alt={getFlexValue(partner.basicInfo, ['name'])} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-12 w-12 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{getFlexValue(partner.basicInfo, ['name', 'fullName', 'full_name']) || 'N/A'}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${partner.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    partner.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {partner.status?.toUpperCase().replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm bg-white p-3 rounded-lg border border-gray-100">
                                        <InfoItem label="Phone" value={getFlexValue(partner.basicInfo, ['phone', 'phoneNumber', 'mobile', 'contact'])} />
                                        <InfoItem label="Email" value={getFlexValue(partner.basicInfo, ['email', 'emailId'])} />
                                        <InfoItem label="Registered On" value={partner.registrationDate} />
                                    </div>

                                    {partner.rejectionReason && (
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-700">
                                            <span className="font-semibold">Rejection Reason:</span> {partner.rejectionReason}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        <InfoItem label="Full Address" value={getFlexValue(partner.basicInfo, ['address', 'fullAddress'])} fullWidth />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. KYC & VEHICLE DETAILS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <SectionHeader title="KYC Verification" icon={Shield} />
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">Aadhaar Card Image</p>
                                        <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
                                            {getFlexValue(partner.kyc, ['aadhaarBase64', 'aadhaarImage', 'aadhaar_image', 'image']) ? (
                                                <img src={getFlexValue(partner.kyc, ['aadhaarBase64', 'aadhaarImage', 'aadhaar_image', 'image'])} alt="Aadhaar" className="h-full w-full object-contain" />
                                            ) : (
                                                <span className="text-gray-400 text-sm">No Image Uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                     <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">License Card Image</p>
                                        <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
                                            {getFlexValue(partner.kyc, ['licenseBase64']) ? (
                                                <img src={getFlexValue(partner.kyc, ['licenseBase64'])} alt="Aadhaar" className="h-full w-full object-contain" />
                                            ) : (
                                                <span className="text-gray-400 text-sm">No Image Uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                     <div className="mt-4">
                                        <p className="text-sm text-gray-500 mb-2">Pan Card Image</p>
                                        <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
                                            {getFlexValue(partner.kyc, ['panBase64']) ? (
                                                <img src={getFlexValue(partner.kyc, ['panBase64'])} alt="Aadhaar" className="h-full w-full object-contain" />
                                            ) : (
                                                <span className="text-gray-400 text-sm">No Image Uploaded</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <SectionHeader title="Vehicle Details" icon={Truck} />
                                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem label="Vehicle Type" value={getFlexValue(partner.vehicle, ['vehicleType', 'type', 'vehicle_type'])} />
                                        <InfoItem label="License Number" value={getFlexValue(partner.vehicle, ['license'])} />
                                        <InfoItem label="Bike Model" value={getFlexValue(partner.vehicle, ['model'])} />
                                        <InfoItem label="Plate Number" value={getFlexValue(partner.vehicle, ['plate'])} />
                                        <InfoItem label="RC Number" value={getFlexValue(partner.vehicle, ['rcNumber', 'rcNo', 'rc_number'])} />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm text-gray-500">Insurance Available?</span>
                                            <div><BooleanBadge value={getFlexValue(partner.vehicle, ['insuranceAvailable', 'insurance', 'hasInsurance'])} /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. PAYMENT & PERMISSIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <SectionHeader title="Payment Details" icon={CreditCard} />
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <InfoItem label="Account Number" value={getFlexValue(partner.payment, ['accountNo', 'accountNumber', 'account_number', 'accNo'])} />
                                    <InfoItem label="Bank Name" value={getFlexValue(partner.payment, ['bankName', 'bank', 'bank_name'])} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InfoItem label="IFSC Code" value={getFlexValue(partner.payment, ['ifscCode', 'ifsc', 'ifsc_code'])} />
                                        <InfoItem label="UPI ID" value={getFlexValue(partner.payment, ['upiId', 'upi', 'upi_id'])} />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <SectionHeader title="App Permissions" icon={SettingsIcon} />
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Camera className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">Camera Access</span>
                                        </div>
                                        <BooleanBadge value={getFlexValue(partner.permissions, ['cameraAllowed', 'camera'])} trueText="Allowed" falseText="Denied" />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Map className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">GPS/Location</span>
                                        </div>
                                        <BooleanBadge value={getFlexValue(partner.permissions, ['gpsAllowed', 'gps', 'location'])} trueText="Allowed" falseText="Denied" />
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-gray-500" />
                                            <span className="text-sm text-gray-700">Notifications</span>
                                        </div>
                                        <BooleanBadge value={getFlexValue(partner.permissions, ['notificationAllowed', 'notifications', 'notification'])} trueText="Allowed" falseText="Denied" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    
                    </div>

                    {/* 5. OTHER FIELDS (Dynamic) */}
                    {(() => {
                        const knownKeys = [
                            'id', 'basicInfo', 'kyc', 'vehicle', 'payment', 'permissions',
                            'status', 'rejectionReason', 'createdAt', 'verifiedAt', 'updatedAt',
                            'registrationDate', 'verifiedAtDate', 'updatedAtDate', 'image', // UI derived keys
                            'aadhaarImage' // UI derived keys
                        ];
                        const otherKeys = Object.keys(partner).filter(key => !knownKeys.includes(key));

                        if (otherKeys.length > 0) {
                            return (
                                <div className="mb-6">
                                    <SectionHeader title="Additional Information" icon={FileText} />
                                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {otherKeys.map(key => (
                                                <div key={key}>
                                                    <p className="text-sm text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                    <p className="font-medium text-gray-900 break-words">
                                                        {typeof partner[key] === 'object' ? JSON.stringify(partner[key]) : String(partner[key])}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* Actions */}
                    <div className="pt-6 border-t flex justify-end gap-3 sticky bottom-0 bg-white pb-2">
                        {partner.status === 'pending_verification' && (
                            <>
                                <button
                                    onClick={() => {
                                        handleRejectPartner(partner.id);
                                        setShowPartnerDetailsModal(false);
                                    }}
                                    className="px-6 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition shadow-sm font-medium border border-red-200"
                                >
                                    Reject Application
                                </button>
                                <button
                                    onClick={() => {
                                        handleApprovePartner(partner.id);
                                        setShowPartnerDetailsModal(false);
                                    }}
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow-sm font-medium"
                                >
                                    Approve Partner
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => setShowPartnerDetailsModal(false)}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition shadow-sm font-medium"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>

        , document.body);
};

// Simple Icon wrapper for consistent usage if needed, though direct import is better
const SettingsIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

export default PartnerDetailsModal;
