import React from 'react';
import {
    Utensils, Pill, ShoppingCart, Apple, Beef, Shirt,
    Check, Info, Flame, Scale, Package, Calendar
} from 'lucide-react';

const CategorySpecificFields = ({ vendorInfo, newProduct, setNewProduct }) => {
    if (!vendorInfo) return null;

    const InputField = ({ label, value, onChange, placeholder, type = 'text', required = false, disabled = false, min, max, step }) => (
        <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type={type}
                className={`w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black focus:bg-white transition-all text-black ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );

    const SelectField = ({ label, value, onChange, options, required = false }) => (
        <div className="space-y-2 flex-1">
            <label className="text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );

    switch (vendorInfo.categoryName) {
        case 'Food':
            return (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
                        <Utensils className="w-4 h-4" /> Food Product Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Food Type *</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                value={newProduct.isVeg ? 'Veg' : 'Non-Veg'} // Basic mapping, adjust as needed if state stores boolean
                                onChange={(e) => setNewProduct({ ...newProduct, isVeg: e.target.value === 'Veg' })}
                            >
                                <option value="Veg">Vegetarian</option>
                                <option value="Non-Veg">Non-Vegetarian</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Cuisine *</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                value={newProduct.cuisine}
                                onChange={(e) => setNewProduct({ ...newProduct, cuisine: e.target.value })}
                            >
                                <option value="Indian">Indian</option>
                                <option value="Chinese">Chinese</option>
                                <option value="Italian">Italian</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Continental">Continental</option>
                                <option value="Fast Food">Fast Food</option>
                                <option value="Street Food">Street Food</option>
                                <option value="Desserts">Desserts</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Ingredients</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                            value={newProduct.ingredients}
                            onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                            placeholder="List main ingredients..."
                            rows="2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Spice Level</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                value={newProduct.spiceLevel}
                                onChange={(e) => setNewProduct({ ...newProduct, spiceLevel: e.target.value })}
                            >
                                <option value="mild">Mild</option>
                                <option value="medium">Medium</option>
                                <option value="spicy">Spicy</option>
                                <option value="very-spicy">Very Spicy</option>
                            </select>
                        </div>

                        <InputField
                            label="Calories (approx)"
                            value={newProduct.calories}
                            onChange={(val) => setNewProduct({ ...newProduct, calories: val })}
                            placeholder="e.g., 250 kcal"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Prep Time (min)"
                            value={newProduct.preparationTime}
                            onChange={(val) => setNewProduct({ ...newProduct, preparationTime: val })}
                            placeholder="15-20"
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Packaging Type</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                value={newProduct.packagingType}
                                onChange={(e) => setNewProduct({ ...newProduct, packagingType: e.target.value })}
                            >
                                <option value="Regular">Regular</option>
                                <option value="Eco-friendly">Eco-friendly</option>
                                <option value="Premium">Premium</option>
                                <option value="Microwave Safe">Microwave Safe</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            id="foodBestSeller"
                            checked={newProduct.bestseller}
                            onChange={(e) => setNewProduct({ ...newProduct, bestseller: e.target.checked })}
                            className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500"
                        />
                        <label htmlFor="foodBestSeller" className="text-sm font-medium text-gray-700">
                            Mark as Best Seller
                        </label>
                    </div>
                </div>
            );

        case 'Medicine':
            return (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
                        <Pill className="w-4 h-4" /> Medicine Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Medicine Type *"
                            value={newProduct.medicineType}
                            onChange={(val) => setNewProduct({ ...newProduct, medicineType: val })}
                            options={[
                                { value: 'tablet', label: 'Tablet' },
                                { value: 'syrup', label: 'Syrup' },
                                { value: 'injection', label: 'Injection' },
                                { value: 'ointment', label: 'Cream/Ointment' },
                                { value: 'drops', label: 'Eye/Ear Drops' },
                                { value: 'inhaler', label: 'Inhaler' },
                                { value: 'suppository', label: 'Suppository' },
                            ]}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Expiry Date *</label>
                            <input
                                type="date"
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                value={newProduct.expiryDate}
                                onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            checked={newProduct.prescriptionRequired}
                            onChange={(e) => setNewProduct({ ...newProduct, prescriptionRequired: e.target.checked })}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Prescription Required
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Salt Composition"
                            value={newProduct.saltComposition}
                            onChange={(val) => setNewProduct({ ...newProduct, saltComposition: val })}
                            placeholder="Active ingredient"
                        />

                        <InputField
                            label="Batch Number *"
                            value={newProduct.batchNumber}
                            onChange={(val) => setNewProduct({ ...newProduct, batchNumber: val })}
                            placeholder="Batch/Lot number"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Dosage Instructions</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                            value={newProduct.dosageInstructions}
                            onChange={(e) => setNewProduct({ ...newProduct, dosageInstructions: e.target.value })}
                            placeholder="Take 1 tablet twice daily after meals"
                            rows="2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Manufacturer"
                            value={newProduct.manufacturer}
                            onChange={(val) => setNewProduct({ ...newProduct, manufacturer: val })}
                            placeholder="Pharmaceutical company"
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Storage Conditions</label>
                            <select
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                value={newProduct.storageConditions}
                                onChange={(e) => setNewProduct({ ...newProduct, storageConditions: e.target.value })}
                            >
                                <option value="">Select Condition</option>
                                <option value="Room Temperature">Room Temperature</option>
                                <option value="Refrigerate">Refrigerate (2-8°C)</option>
                                <option value="Cool Place">Cool Dry Place</option>
                                <option value="Avoid Sunlight">Avoid Sunlight</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Side Effects (optional)</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                            value={newProduct.sideEffects}
                            onChange={(e) => setNewProduct({ ...newProduct, sideEffects: e.target.value })}
                            placeholder="Common side effects..."
                            rows="2"
                        />
                    </div>
                </div>
            );

        case 'Groceries':
            return (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" /> Grocery Product Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Product Type *"
                            value={newProduct.groceryType}
                            onChange={(val) => setNewProduct({ ...newProduct, groceryType: val })}
                            options={[
                                { value: 'staples', label: 'Staples' },
                                { value: 'snacks', label: 'Snacks' },
                                { value: 'beverages', label: 'Beverages' },
                                { value: 'dairy', label: 'Dairy Products' },
                                { value: 'frozen', label: 'Frozen Foods' },
                                { value: 'cooking', label: 'Cooking Essentials' },
                                { value: 'household', label: 'Household Items' },
                                { value: 'personal-care', label: 'Personal Care' },
                            ]}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Net Weight/Volume *</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    value={newProduct.netWeight}
                                    onChange={(e) => setNewProduct({ ...newProduct, netWeight: e.target.value })}
                                    placeholder="e.g., 500"
                                    required
                                />
                                <select
                                    className="w-24 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    value={newProduct.weightUnit}
                                    onChange={(e) => setNewProduct({ ...newProduct, weightUnit: e.target.value })}
                                >
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="ml">ml</option>
                                    <option value="l">l</option>
                                    <option value="piece">pc</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Country of Origin"
                            value={newProduct.countryOfOrigin}
                            onChange={(val) => setNewProduct({ ...newProduct, countryOfOrigin: val })}
                            placeholder="India"
                        />

                        <InputField
                            label="Manufacturer Details"
                            value={newProduct.manufacturerGrocery}
                            onChange={(val) => setNewProduct({ ...newProduct, manufacturerGrocery: val })}
                            placeholder="Manufacturer name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Storage Instructions</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                            value={newProduct.storageInstructions}
                            onChange={(e) => setNewProduct({ ...newProduct, storageInstructions: e.target.value })}
                            placeholder="Store in cool, dry place..."
                            rows="2"
                        />
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            checked={newProduct.organic}
                            onChange={(e) => setNewProduct({ ...newProduct, organic: e.target.checked })}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label className="text-sm font-medium text-gray-700">Organic Product</label>
                    </div>
                </div>
            );

        case 'Dress & Gadgets':
            return (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
                        <Shirt className="w-4 h-4" /> Dress & Clothing Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Gender *"
                            value={newProduct.gender}
                            onChange={(val) => setNewProduct({ ...newProduct, gender: val })}
                            options={[
                                { value: 'men', label: 'Men' },
                                { value: 'women', label: 'Women' },
                                { value: 'kids', label: 'Kids' },
                                { value: 'unisex', label: 'Unisex' },
                            ]}
                            required
                        />

                        <InputField
                            label="Size"
                            value={newProduct.size}
                            onChange={(val) => setNewProduct({ ...newProduct, size: val })}
                            placeholder="S, M, L, XL"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Color Options</label>
                        <input
                            type="text"
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                            value={newProduct.colorOptions}
                            onChange={(e) => setNewProduct({ ...newProduct, colorOptions: e.target.value })}
                            placeholder="Red, Blue, Black, White"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Fabric/Material"
                            value={newProduct.fabricMaterial}
                            onChange={(val) => setNewProduct({ ...newProduct, fabricMaterial: val })}
                            placeholder="Cotton, Silk, Polyester"
                        />

                        <SelectField
                            label="Fit Type"
                            value={newProduct.fitType}
                            onChange={(val) => setNewProduct({ ...newProduct, fitType: val })}
                            options={[
                                { value: '', label: 'Select Fit' },
                                { value: 'slim', label: 'Slim' },
                                { value: 'regular', label: 'Regular' },
                                { value: 'loose', label: 'Loose' },
                                { value: 'oversized', label: 'Oversized' },
                            ]}
                        />
                    </div>

                    <SelectField
                        label="Occasion"
                        value={newProduct.occasionDress}
                        onChange={(val) => setNewProduct({ ...newProduct, occasionDress: val })}
                        options={[
                            { value: '', label: 'Select Occasion' },
                            { value: 'casual', label: 'Casual' },
                            { value: 'formal', label: 'Formal' },
                            { value: 'party', label: 'Party' },
                            { value: 'sports', label: 'Sports' },
                            { value: 'ethnic', label: 'Ethnic' },
                        ]}
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Wash Care Instructions</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                            value={newProduct.washCareInstructions}
                            onChange={(e) => setNewProduct({ ...newProduct, washCareInstructions: e.target.value })}
                            placeholder="Machine wash cold, Do not bleach..."
                            rows="2"
                        />
                    </div>

                    <InputField
                        label="Country of Manufacture"
                        value={newProduct.countryOfManufacture}
                        onChange={(val) => setNewProduct({ ...newProduct, countryOfManufacture: val })}
                        placeholder="India"
                    />
                </div>
            );

        case 'Fruits & Vegetables':
            return (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
                        <Apple className="w-4 h-4" /> Fruits & Vegetables Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Type *"
                            value={newProduct.fruitVegetableType}
                            onChange={(val) => setNewProduct({ ...newProduct, fruitVegetableType: val })}
                            options={[
                                { value: 'fruits', label: 'Fruits' },
                                { value: 'vegetables', label: 'Vegetables' },
                                { value: 'leafy-greens', label: 'Leafy Greens' },
                                { value: 'herbs', label: 'Herbs' },
                            ]}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Weight *</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    value={newProduct.weightFruits}
                                    onChange={(e) => setNewProduct({ ...newProduct, weightFruits: e.target.value })}
                                    placeholder="e.g., 1"
                                    required
                                />
                                <select
                                    className="w-24 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    value={newProduct.weightUnitFruits}
                                    onChange={(e) => setNewProduct({ ...newProduct, weightUnitFruits: e.target.value })}
                                >
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="piece">pc</option>
                                    <option value="bunch">bunch</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            checked={newProduct.organicFruit}
                            onChange={(e) => setNewProduct({ ...newProduct, organicFruit: e.target.checked })}
                            className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Organic Product
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            label="Freshness Duration"
                            value={newProduct.freshnessDuration}
                            onChange={(val) => setNewProduct({ ...newProduct, freshnessDuration: val })}
                            placeholder="3-5 days"
                        />

                        <SelectField
                            label="Cut Option"
                            value={newProduct.cutOption}
                            onChange={(val) => setNewProduct({ ...newProduct, cutOption: val })}
                            options={[
                                { value: 'uncut', label: 'Uncut' },
                                { value: 'cut', label: 'Cut' },
                                { value: 'cleaned', label: 'Cleaned' },
                                { value: 'chopped', label: 'Chopped' },
                            ]}
                        />
                    </div>

                    <SelectField
                        label="Storage Instructions"
                        value={newProduct.storageInstructionsFruits}
                        onChange={(val) => setNewProduct({ ...newProduct, storageInstructionsFruits: val })}
                        options={[
                            { value: 'refrigerate', label: 'Refrigerate' },
                            { value: 'room-temperature', label: 'Room Temperature' },
                            { value: 'cool-dry-place', label: 'Cool Dry Place' },
                        ]}
                    />

                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                        <input
                            type="checkbox"
                            checked={newProduct.seasonalFruit}
                            onChange={(e) => setNewProduct({ ...newProduct, seasonalFruit: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-gray-700">
                            Seasonal Product
                        </label>
                    </div>
                </div>
            );

        case 'Meat & Fish':
            return (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 text-sm border-b pb-2 flex items-center gap-2">
                        <Beef className="w-4 h-4" /> Meat & Fish Details
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Meat Type *"
                            value={newProduct.meatFishType}
                            onChange={(val) => setNewProduct({ ...newProduct, meatFishType: val })}
                            options={[
                                { value: 'chicken', label: 'Chicken' },
                                { value: 'mutton', label: 'Mutton' },
                                { value: 'fish', label: 'Fish' },
                                { value: 'prawns', label: 'Prawns' },
                                { value: 'crab', label: 'Crab' },
                                { value: 'eggs', label: 'Eggs' },
                                { value: 'processed', label: 'Processed Meat' },
                            ]}
                            required
                        />

                        <SelectField
                            label="Cut Type *"
                            value={newProduct.cutType}
                            onChange={(val) => setNewProduct({ ...newProduct, cutType: val })}
                            options={[
                                { value: 'curry-cut', label: 'Curry Cut' },
                                { value: 'boneless', label: 'Boneless' },
                                { value: 'whole', label: 'Whole' },
                                { value: 'fillet', label: 'Fillet' },
                                { value: 'minced', label: 'Minced' },
                                { value: 'slices', label: 'Slices' },
                            ]}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Weight *</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="flex-1 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    value={newProduct.weightMeat}
                                    onChange={(e) => setNewProduct({ ...newProduct, weightMeat: e.target.value })}
                                    placeholder="e.g., 500"
                                    required
                                />
                                <select
                                    className="w-24 p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                                    value={newProduct.weightUnitMeat}
                                    onChange={(e) => setNewProduct({ ...newProduct, weightUnitMeat: e.target.value })}
                                >
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="lb">lb</option>
                                </select>
                            </div>
                        </div>

                        <SelectField
                            label="Freshness"
                            value={newProduct.freshFrozen}
                            onChange={(val) => setNewProduct({ ...newProduct, freshFrozen: val })}
                            options={[
                                { value: 'fresh', label: 'Fresh' },
                                { value: 'frozen', label: 'Frozen' },
                                { value: 'marinated', label: 'Marinated' },
                                { value: 'ready-to-cook', label: 'Ready to Cook' },
                            ]}
                        />
                    </div>

                    <InputField
                        label="Source"
                        value={newProduct.source}
                        onChange={(val) => setNewProduct({ ...newProduct, source: val })}
                        placeholder="Farm name or region"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            label="Packaging"
                            value={newProduct.packagingTypeMeat}
                            onChange={(val) => setNewProduct({ ...newProduct, packagingTypeMeat: val })}
                            options={[
                                { value: 'vacuum-packed', label: 'Vacuum Packed' },
                                { value: 'ice-packed', label: 'Ice Packed' },
                                { value: 'regular', label: 'Regular Packaging' },
                                { value: 'premium', label: 'Premium Packaging' },
                            ]}
                        />

                        <SelectField
                            label="Delivery Slot"
                            value={newProduct.deliverySlot}
                            onChange={(val) => setNewProduct({ ...newProduct, deliverySlot: val })}
                            options={[
                                { value: 'morning', label: 'Morning (8AM-12PM)' },
                                { value: 'afternoon', label: 'Afternoon (12PM-4PM)' },
                                { value: 'evening', label: 'Evening (4PM-8PM)' },
                                { value: 'any', label: 'Any Time' },
                            ]}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Storage Instructions</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-black transition-colors text-black"
                            value={newProduct.storageInstructionsMeat}
                            onChange={(e) => setNewProduct({ ...newProduct, storageInstructionsMeat: e.target.value })}
                            placeholder="Freeze immediately upon delivery..."
                            rows="2"
                        />
                    </div>
                </div>
            );

        default:
            return (
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 text-sm border-b pb-2">{vendorInfo.categoryName} Details</h3>
                    <p className="text-sm text-gray-500">No specific fields for this category.</p>
                </div>
            );
    }
};

export default CategorySpecificFields;
