import apiClient from './apiClient';

/**
 * Service for handling file uploads to the backend
 */
const uploadService = {
  /**
   * Uploads a single image to the backend
   * @param {File} file - The file object to upload
   * @returns {Promise<{url: string}>} - The relative URL of the uploaded image
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        return response.data;
      } else {
        throw new Error('Upload failed: Invalid response from server');
      }
    } catch (error) {
      console.error('Error in uploadService.uploadImage:', error);
      throw error;
    }
  },

  /**
   * Helper to get the full URL of an uploaded image
   * Useful when the backend returns a relative path like /uploads/...
   */
  getFullUrl: (relativeUrl) => {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    
    // Get backend base URL from apiClient's config or env
    const backendUrl = apiClient.defaults.baseURL.replace('/api', '');
    return `${backendUrl}${relativeUrl}`;
  }
};

export default uploadService;
