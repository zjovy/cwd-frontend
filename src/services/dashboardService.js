import { auth } from '@/firebase-config';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/dashboard`;

async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function request(url, options = {}) {
  const { signal, ...rest } = options;
  const headers = await authHeaders();
  const res = await fetch(url, {
    ...rest,
    headers,
    credentials: 'include',
    signal,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body.error || body.message || `Request failed (${res.status})`
    );
  }

  return res.json();
}

const dashboardService = {
  async getTrend(signal) {
    return request(`${BASE_URL}/trend`, { signal });
  },

  async getLast6Months(signal) {
    return request(`${BASE_URL}/last6months`, { signal });
  },

  async getSummary(signal) {
    return request(`${BASE_URL}/summary`, { signal });
  },

  async getRecentDonations(signal) {
    return request(`${BASE_URL}/recent`, { signal });
  },
};

export default dashboardService;
