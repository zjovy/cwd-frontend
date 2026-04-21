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

const donorService = {
  getAll(search, signal) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    return request(`${BASE_URL}${query}`, { signal });
  },

  getById(id, signal) {
    return request(`${BASE_URL}/${id}`, { signal });
  },

  update(id, data) {
    return request(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete(id) {
    return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
  },
};

export default donorService;
