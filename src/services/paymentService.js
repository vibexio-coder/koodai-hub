import apiClient from './apiClient.js';

// ─── Payment Service ──────────────────────────────────────────────────────────

const paymentService = {

  // GET /api/payments
  getPayments: async (params = {}) => {
    const res = await apiClient.get('/payments', { params });
    return res.data;
  },

  // GET /api/payments/summary  ← aggregation
  getSummary: async (params = {}) => {
    const res = await apiClient.get('/payments/summary', { params });
    return res.data;
  },

  // GET /api/payments/vendor/:vendorId/summary
  getVendorSummary: async (vendorId) => {
    const res = await apiClient.get(`/payments/vendor/${vendorId}/summary`);
    return res.data;
  },

  // GET /api/payments/payouts
  getPayouts: async (params = {}) => {
    const res = await apiClient.get('/payments/payouts', { params });
    return res.data;
  },

  // POST /api/payments/payouts
  createPayout: async (payload) => {
    const res = await apiClient.post('/payments/payouts', payload);
    return res.data;
  },

  // PATCH /api/payments/payouts/:id
  updatePayout: async (id, payload) => {
    const res = await apiClient.patch(`/payments/payouts/${id}`, payload);
    return res.data;
  },

  // Convenience: mark payout completed
  completePayout: async (id, transactionId) =>
    paymentService.updatePayout(id, { status: 'completed', transactionId }),
};

export default paymentService;
