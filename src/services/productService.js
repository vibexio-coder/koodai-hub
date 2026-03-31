import apiClient from './apiClient.js';

// ─── Product Service ──────────────────────────────────────────────────────────

const productService = {

  // GET /api/products
  // params: { vendor, category, status, featured, search, page, limit }
  getAll: async (params = {}) => {
    const res = await apiClient.get('/products', { params });
    return res.data; // { success, total, page, pages, data: [] }
  },

  // GET /api/products/:id
  getById: async (id) => {
    const res = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  // POST /api/products  🔐 Auth (Vendor/Admin)
  create: async (payload) => {
    const res = await apiClient.post('/products', payload);
    return res.data;
  },

  // PATCH /api/products/:id  🔐 Auth (Owner/Admin)
  update: async (id, payload) => {
    const res = await apiClient.patch(`/products/${id}`, payload);
    return res.data;
  },

  // DELETE /api/products/:id  🔐 Auth (Owner/Admin)
  delete: async (id) => {
    const res = await apiClient.delete(`/products/${id}`);
    return res.data;
  },

  // Convenience
  updateStock: async (id, stock) => productService.update(id, { stock }),
  updateStatus: async (id, status) => productService.update(id, { status }),
  
  // Scoped fetch for a specific vendor
  getByVendor: async (vendorId, params = {}) => 
    productService.getAll({ ...params, vendor: vendorId }),
};

export default productService;
