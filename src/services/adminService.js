import { auth } from '@/firebase-config';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/auth`;

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

const adminService = {
  getUsers() {
    return request(`${BASE_URL}/users`);
  },

  setApproved(uid, isApproved) {
    return request(`${BASE_URL}/users/${uid}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ isApproved }),
    });
  },

  setAdmin(uid, isAdmin) {
    return request(`${BASE_URL}/users/${uid}/admin`, {
      method: 'PATCH',
      body: JSON.stringify({ isAdmin }),
    });
  },
};

export default adminService;
