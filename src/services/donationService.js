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
  const headers = await authHeaders();
  const res = await fetch(url, { ...options, headers, credentials: 'include' });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Request failed (${res.status})`);
  }

  return res.json();
}

const donationService = {
  getAll(params = {}) {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString();
    return request(`${BASE_URL}${query ? `?${query}` : ''}`);
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
