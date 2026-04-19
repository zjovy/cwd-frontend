import { auth } from '@/firebase-config';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/donations`;

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
  const res = await fetch(url, { ...rest, headers, credentials: 'include', signal });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

/** Normalize GET /donations payloads (array vs `{ donations, total }`, alternate keys). */
function normalizeDonationsListPayload(raw) {
  if (raw == null) return { donations: [], total: 0 };
  if (Array.isArray(raw)) return { donations: raw, total: raw.length };
  if (typeof raw !== 'object') return { donations: [], total: 0 };

  const rows = raw.donations ?? raw.data ?? raw.results;
  const donations = Array.isArray(rows) ? rows : [];
  const totalRaw = raw.total ?? raw.count ?? raw.meta?.total;
  const n = typeof totalRaw === 'number' ? totalRaw : Number(totalRaw);
  const total = Number.isFinite(n) && n >= 0 ? n : donations.length;

  return { donations, total };
}

const donationService = {
  async getAll(params = {}, signal) {
    const { signal: _ignored, ...rest } = params;
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(rest).filter(([, v]) => v != null && v !== ''))
    ).toString();
    const raw = await request(`${BASE_URL}${query ? `?${query}` : ''}`, { signal });
    return normalizeDonationsListPayload(raw);
  },

  getById(id) {
    return request(`${BASE_URL}/${id}`);
  },

  create(data) {
    return request(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update(id, data) {
    return request(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id) {
    return request(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  },
};

export default donationService;
