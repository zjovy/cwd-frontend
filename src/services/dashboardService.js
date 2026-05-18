import { buildUrl, request } from '@/api/client';
import { ENDPOINTS } from '@/api/endpoints';

const dashboardService = {
  getTrend(signal) {
    return request(buildUrl(ENDPOINTS.DASHBOARD_TREND), { signal });
  },

  getLast6Months(signal) {
    return request(buildUrl(ENDPOINTS.DASHBOARD_LAST6), { signal });
  },

  getSummary(signal) {
    return request(buildUrl(ENDPOINTS.DASHBOARD_SUMMARY), { signal });
  },

  syncStripe() {
    return request(buildUrl(ENDPOINTS.SYNC_STRIPE), { method: 'POST' });
  },
};

export default dashboardService;
