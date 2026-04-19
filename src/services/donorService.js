import { auth } from '@/firebase-config';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/donors`;

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


function normalizeDonorsListPayload(raw) {
  if (raw == null) return { donors: [], total: 0 };
  if (Array.isArray(raw)) return { donors: raw, total: raw.length };
  if (typeof raw !== 'object') return { donors: [], total: 0 };

  const rows = raw.donors ?? raw.data ?? raw.results;
  const donors = Array.isArray(rows) ? rows : [];
  const totalRaw = raw.total ?? raw.count ?? raw.meta?.total;
  const n = typeof totalRaw === 'number' ? totalRaw : Number(totalRaw);
  const total = Number.isFinite(n) && n >= 0 ? n : donors.length;

  return { donors, total };
}

/** Optional string fields: empty string / undefined → null for SQL-friendly JSON bodies. */
const OPTIONAL_NULL_STRING_KEYS = ['address', 'phone', 'most_recent'];

function normalizeDonorBody(data) {
  if (data == null || typeof data !== 'object') return data;
  const out = { ...data };
  for (const key of OPTIONAL_NULL_STRING_KEYS) {
    if (!(key in out)) continue;
    const v = out[key];
    if (v === undefined || v === null) {
      out[key] = null;
    } else if (typeof v === 'string' && v.trim() === '') {
      out[key] = null;
    }
  }
  const td = out.total_donations;
  if (td === '' || td === undefined) out.total_donations = null;
  else if (typeof td === 'number' && !Number.isFinite(td)) out.total_donations = null;

  const dc = out.donation_count;
  if (dc === '' || dc === undefined) out.donation_count = null;
  else if (typeof dc === 'number' && !Number.isFinite(dc)) out.donation_count = null;
  else if (typeof dc === 'string' && dc.trim() === '') out.donation_count = null;

  return out;
}

const donorService = {
  async getAll(params = {}, signal) {
    const { signal: _ignored, ...rest } = params;
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(rest).filter(([, v]) => v != null && v !== ''))
    ).toString();
    const raw = await request(`${BASE_URL}${query ? `?${query}` : ''}`, { signal });
    return normalizeDonorsListPayload(raw);
  },

  getById(id) {
    return request(`${BASE_URL}/${id}`);
  },

  create(data) {
    return request(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(normalizeDonorBody(data)),
    });
  },

  update(id, data) {
    return request(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizeDonorBody(data)),
    });
  },

  delete(id) {
    return request(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  },
};

export default donorService;
