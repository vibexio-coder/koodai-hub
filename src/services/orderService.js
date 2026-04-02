import apiClient from './apiClient';

/**
 * Service for managing orders.
 * Interacts with the /api/orders endpoint.
 */
const orderService = {
  /**
   * Fetch all orders with optional filters (e.g., status, userId, vendorId).
   * @param {Object} filters Query parameters for filtering and pagination
   * @returns {Promise<Array>} List of orders or empty array on failure.
   */
  getAll: async (filters = {}) => {
    try {
      const response = await apiClient.get('/orders', { params: filters });
      // Backend returns { success: true, data: [...] }
      return response.data?.data || response.data?.orders || response.data || [];
    } catch (error) {
      console.error('[orderService] getAll failed:', error.displayMessage || error.message);
      return [];
    }
  },

  /**
   * Fetch a single order by ID.
   * @param {string} id Order ID
   * @returns {Promise<Object|null>} Order data or null on failure.
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/orders/${id}`);
      // Backend returns { success: true, data: {...} }
      return response.data?.data || response.data?.order || response.data || null;
    } catch (error) {
      console.error('[orderService] getById failed:', error.displayMessage || error.message);
      return null;
    }
  },

  /**
   * Update the status of an existing order.
   * @param {string} id Order ID
   * @param {string} status New status (e.g., 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')
   * @returns {Promise<Object|null>} Updated order or null on failure.
   */
  updateStatus: async (id, status) => {
    try {
      const response = await apiClient.patch(`/orders/${id}/status`, { status });
      return response.data?.order || response.data || null;
    } catch (error) {
      console.error('[orderService] updateStatus failed:', error.displayMessage || error.message);
      throw error;
    }
  }
};

export default orderService;
