import apiClient from './apiClient';

/**
 * Service for managing product categories.
 * Interacts with the /api/categories endpoint.
 */
const categoryService = {
  /**
   * Fetch all categories.
   * @returns {Promise<Array>} List of categories or empty array on failure.
   */
  getAll: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data?.categories || response.data || [];
    } catch (error) {
      console.error('[categoryService] getAll failed:', error.displayMessage || error.message);
      return []; // Safe fallback
    }
  },

  /**
   * Create a new category.
   * @param {Object} data Category data { name, description, image, etc. }
   * @returns {Promise<Object|null>} Created category or null on failure.
   */
  create: async (data) => {
    try {
      const response = await apiClient.post('/categories', data);
      return response.data?.category || response.data || null;
    } catch (error) {
      console.error('[categoryService] create failed:', error.displayMessage || error.message);
      throw error; // Rethrow to let components show specific error toasts
    }
  },

  /**
   * Update an existing category.
   * @param {string} id Category ID
   * @param {Object} data Updated fields
   * @returns {Promise<Object|null>} Updated category or null on failure.
   */
  update: async (id, data) => {
    try {
      const response = await apiClient.put(`/categories/${id}`, data);
      return response.data?.category || response.data || null;
    } catch (error) {
      console.error('[categoryService] update failed:', error.displayMessage || error.message);
      throw error;
    }
  },

  /**
   * Delete (Soft Delete) a category.
   * Internal implementation usually sets status to 'inactive'.
   * @param {string} id Category ID
   * @returns {Promise<boolean>} True if successful.
   */
  delete: async (id) => {
    try {
      await apiClient.delete(`/categories/${id}`);
      return true;
    } catch (error) {
      console.error('[categoryService] delete failed:', error.displayMessage || error.message);
      return false;
    }
  }
};

export default categoryService;
