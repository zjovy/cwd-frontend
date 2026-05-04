// Normalize GET /donations list response (handles array vs { donations, total } shapes)
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

// Normalize GET /donors list response (handles array vs { donors, total } shapes)
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

// Add computed fullName to a raw donor row.
export function transformDonor(raw) {
  if (!raw) return raw;
  return {
    ...raw,
    fullName: `${raw.first_name ?? ''} ${raw.last_name ?? ''}`.trim(),
  };
}

// Add computed donorFullName + donorEmail to a raw donation row (from joined donor fields).
export function transformDonation(raw) {
  if (!raw) return raw;
  return {
    ...raw,
    donorFullName: `${raw.first_name ?? ''} ${raw.last_name ?? ''}`.trim(),
    donorEmail: raw.email ?? '',
  };
}

// Normalize + transform a donations list response.
export function transformDonationList(raw) {
  const { donations, total } = normalizeDonationsListPayload(raw);
  return { donations: donations.map(transformDonation), total };
}

// Normalize + transform a donors list response.
export function transformDonorList(raw) {
  const { donors, total } = normalizeDonorsListPayload(raw);
  return { donors: donors.map(transformDonor), total };
}

// Build POST /donors or PUT /donors/:id body — nullifies empty optional strings.
export function buildDonorRequestBody(data) {
  if (data == null || typeof data !== 'object') return data;
  const out = { ...data };
  for (const key of ['address', 'phone']) {
    if (!(key in out)) continue;
    const v = out[key];
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
      out[key] = null;
    }
  }
  return out;
}

// Build POST /donations body (new schema with donor identity fields).
export function buildDonationCreateBody(data) {
  return {
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone ?? null,
    address: data.address ?? null,
    amount: data.amount,
    donation_date: data.donation_date,
    receipt_status: data.receipt_status,
  };
}

// Build PUT /donations/:id body — only the fields the backend accepts on update.
export function buildDonationUpdateBody(data) {
  return {
    amount: data.amount,
    donation_date: data.donation_date,
    receipt_status: data.receipt_status,
  };
}
