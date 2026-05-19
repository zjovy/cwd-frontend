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

  getRangeSummary(startDate, endDate, signal) {
    const q = new URLSearchParams({ startDate, endDate }).toString();
    return request(buildUrl(`${ENDPOINTS.DASHBOARD_RANGE_SUMMARY}?${q}`), {
      signal,
    });
  },

  getRangeTrend(startDate, endDate, bucket, signal) {
    const q = new URLSearchParams({ startDate, endDate, bucket }).toString();
    return request(buildUrl(`${ENDPOINTS.DASHBOARD_RANGE_TREND}?${q}`), {
      signal,
    });
  },
};

export default dashboardService;
