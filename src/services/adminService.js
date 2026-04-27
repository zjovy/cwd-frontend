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
  const res = await fetch(url, { ...options, headers });

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

  setRole(uid, role) {
    return request(`${BASE_URL}/users/${uid}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
};

export default adminService;
