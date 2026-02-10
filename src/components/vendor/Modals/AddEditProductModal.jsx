
import React from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';
import CategorySpecificFields from './CategorySpecificFields';

const AddEditProductModal = ({
    showProductModal,
    setShowProductModal,
    editingProduct,
    setEditingProduct,
    newProduct,
    setNewProduct,
    handleAddProduct,
    loading,
    uploading,
    uploadProgress,
    vendorInfo,
    resetProductForm
}) => {
    if (!showProductModal) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <button
                            onClick={() => {
                                setShowProductModal(false);
                                setEditingProduct(null);
                                resetProductForm();
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Basic Information</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                                    <input
                                        type="text"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value === '' ? '' : e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    rows="3"
                                    placeholder="Product description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        value={newProduct.quantity}
                                        onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value === '' ? '' : e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        placeholder="1"
                                        min="1"
                                    />
                                </div>

                                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        checked={newProduct.availability}
                                        onChange={(e) => setNewProduct({ ...newProduct, availability: e.target.checked })}
                                        className="w-4 h-4 text-green-600"
                                    />
                                    <label className="text-sm font-medium text-gray-700">Available for Sale</label>
                                </div>
                            </div>
                        </div>

                        {/* Product Image */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">Product Image</h3>

                            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${uploading ? 'opacity-50' : ''}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            if (!file.type.match('image.*')) {
                                                toast.error('Please select an image file');
                                                return;
                                            }
                                            if (file.size > 2 * 1024 * 1024) {
                                                toast.error('File size should be less than 2MB');
                                                return;
                                            }
                                            setNewProduct({ ...newProduct, imageFile: file, image: '' });
                                        }
                                    }}
                                    className="hidden"
                                    id="productImageUpload"
                                    disabled={uploading}
                                />
                                <label htmlFor="productImageUpload" className={`cursor-pointer block ${uploading ? 'cursor-not-allowed' : ''}`}>
                                    {uploading ? (
                                        <>
                                            <div className="w-12 h-12 mx-auto mb-3 relative">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-sm text-gray-600">Click to upload product image</p>
                                            <p className="text-xs text-gray-500 mt-1">JPEG, PNG up to 2MB</p>
                                        </>
                                    )}
                                </label>

                                {newProduct.imageFile && !uploading && (
                                    <div className="mt-4">
                                        <p className="text-sm text-green-600">
                                            Selected: {newProduct.imageFile.name}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setNewProduct({ ...newProduct, imageFile: null })}
                                            className="text-sm text-red-600 hover:text-red-800 mt-2"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={newProduct.image}
                                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value, imageFile: null })}
                                    disabled={!!newProduct.imageFile || uploading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="https://example.com/product-image.jpg"
                                />
                            </div>
                        </div>

                        {/* Category Specific Fields */}
                        <CategorySpecificFields
                            vendorInfo={vendorInfo}
                            newProduct={newProduct}
                            setNewProduct={setNewProduct}
                        />

                        {/* Submit Button */}
                        <div className="pt-4 border-t">
                            <button
                                onClick={handleAddProduct}
                                disabled={loading || uploading || !newProduct.name || !newProduct.price}
                                className="w-full py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddEditProductModal;
