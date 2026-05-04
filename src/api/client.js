import { auth } from '@/firebase-config';

const BASE = import.meta.env.VITE_BACKEND_URL ?? '';

export function buildUrl(endpoint) {
  return `${String(BASE).replace(/\/$/, '')}${endpoint}`;
}

export async function authHeaders() {
  const token = await auth.currentUser?.getIdToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function request(url, options = {}) {
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

  const ct = res.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) return null;
  return res.json();
}
