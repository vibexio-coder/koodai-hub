import apiClient from './apiClient';

/**
 * Normalizes backend vendor data to the format expected by the UI.
 * @param {Object} v Raw vendor object from API
 * @returns {Object} UI-compatible vendor object
 */
export const mapVendorToUI = (v) => {
  if (!v) return null;
  return {
    ...v,
    id: v._id || v.id,
    name: v.businessName || v.name,
    businessName: v.businessName || v.name,
    image: v.logo || v.image,
    contact: v.phone || v.email || 'No contact info',
    phone: v.phone,
    email: v.email,
    category: v.categoryName || (v.categories && v.categories[0]?.name) || 'General',
    address: typeof v.address === 'object'
      ? `${v.address.street || ''}, ${v.address.city || ''}`.trim().replace(/^, /, '')
      : v.address,
    status: v.status || 'pending',
    orderCount: v.stats?.totalOrders || v.orderCount || 0,
    totalEarnings: v.stats?.totalRevenue || v.totalEarnings || 0,
    rating: v.stats?.averageRating || v.rating || 4.5,
  };
};

/**
 * Service for managing vendors (stores).
 * Interacts with the /api/vendors endpoint.
 */
const vendorService = {
  /**
   * Fetch all vendors with optional filters.
   * @param {Object} filters Pagination and filtering options
   * @returns {Promise<Array>} List of vendors or empty array on failure.
   */
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/vendors', { params: filters });
      return response.data?.vendors || response.data || [];
    } catch (error) {
      console.error('[vendorService] getAll failed:', error.displayMessage || error.message);
      return [];
    }
  },

  /**
   * Fetch a single vendor by ID.
   * @param {string} id Vendor ID
   * @returns {Promise<Object|null>} Vendor data or null on failure.
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/vendors/${id}`);
      return response.data?.vendor || response.data || null;
    } catch (error) {
      console.error('[vendorService] getById failed:', error.displayMessage || error.message);
      return null;
    }
  },

  /**
   * Create a new vendor (registration).
   * @param {Object} data Vendor registration data
   * @returns {Promise<Object|null>} Created vendor or null on failure.
   */
  create: async (data) => {
    try {
      const response = await apiClient.post('/vendors', data);
      return response.data?.vendor || response.data || null;
    } catch (error) {
      console.error('[vendorService] create failed:', error.displayMessage || error.message);
      throw error;
    }
  },

  /**
   * Update an existing vendor.
   * @param {string} id Vendor ID
   * @param {Object} data Updated fields
   * @returns {Promise<Object|null>} Updated vendor or null on failure.
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/vendors/${id}`, data);
      return response.data?.vendor || response.data || null;
    } catch (error) {
      console.error('[vendorService] update failed:', error.displayMessage || error.message);
      throw error;
    }
  },

  /**
   * General status update for a vendor.
   * @param {string} id Vendor ID
   * @param {string} status 'pending', 'approved', 'rejected', 'suspended'
   * @returns {Promise<Object|null>} Updated vendor or null on failure.
   */
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/vendors/${id}/status`, { status });
      return response.data?.vendor || response.data || null;
    } catch (error) {
      console.error('[vendorService] updateStatus failed:', error.displayMessage || error.message);
      throw error;
    }
  },

  /**
   * Approve a vendor application.
   * @param {string} id Vendor ID
   * @returns {Promise<boolean>} True if successful.
   */
  approve: async (id) => {
    try {
      await apiClient.post(`/vendors/${id}/approve`);
      return true;
    } catch (error) {
      console.error('[vendorService] approve failed:', error.displayMessage || error.message);
      return false;
    }
  },

  /**
   * Reject a vendor application.
   * @param {string} id Vendor ID
   * @param {string} reason Reason for rejection
   * @returns {Promise<boolean>} True if successful.
   */
  reject: async (id, reason) => {
    try {
      await apiClient.post(`/vendors/${id}/reject`, { reason });
      return true;
    } catch (error) {
      console.error('[vendorService] reject failed:', error.displayMessage || error.message);
      return false;
    }
  }
};

export default vendorService;
