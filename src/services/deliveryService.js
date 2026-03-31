import apiClient from './apiClient.js';

// ─── Delivery Partner Service ─────────────────────────────────────────────────

const deliveryService = {

  // GET /api/delivery-partners
  // params: { status, vehicleType, isOnline, zone, page, limit }
  getAll: async (params = {}) => {
    const res = await apiClient.get('/delivery-partners', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/delivery-partners/${id}`);
    return res.data;
  },

  create: async (payload) => {
    const res = await apiClient.post('/delivery-partners', payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await apiClient.patch(`/delivery-partners/${id}`, payload);
    return res.data;
  },

  updateStatus: async (id, payload) => {
    const res = await apiClient.patch(`/delivery-partners/${id}/status`, payload);
    return res.data;
  },

  delete: async (id) => {
    const res = await apiClient.delete(`/delivery-partners/${id}`);
    return res.data;
  },

  // Convenience
  approve: async (id)  => deliveryService.updateStatus(id, { status: 'approved' }),
  reject:  async (id, rejectionReason) =>
    deliveryService.updateStatus(id, { status: 'rejected', rejectionReason }),
  suspend: async (id)  => deliveryService.updateStatus(id, { status: 'suspended' }),
  getPending: async (params = {}) => deliveryService.getAll({ ...params, status: 'pending' }),
};

export default deliveryService;
