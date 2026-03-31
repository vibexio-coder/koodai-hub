import apiClient from './apiClient.js';

// ─── Dashboard Service ────────────────────────────────────────────────────────

const dashboardService = {

  // GET /api/dashboard — platform KPI snapshot
  getStats: async () => {
    const res = await apiClient.get('/dashboard');
    return res.data;
  },

  // GET /api/dashboard/trends?days=30
  getTrends: async (days = 30) => {
    const res = await apiClient.get('/dashboard/trends', { params: { days } });
    return res.data;
  },
};

export default dashboardService;
