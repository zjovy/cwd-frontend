export function parseLocalDate(str, endOfDay = false) {
  const [y, m, d] = str.split('-').map(Number);
  return endOfDay
    ? new Date(y, m - 1, d, 23, 59, 59, 999)
    : new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getEffectiveBucket(rangeDays, override) {
  if (override !== 'auto') return override;
  if (rangeDays <= 45) return 'day';
  if (rangeDays <= 540) return 'month';
  return 'year';
}

function bucketKey(date, bucket) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  if (bucket === 'day') return `${y}-${m}-${d}`;
  if (bucket === 'month') return `${y}-${m}`;
  return String(y);
}

function bucketLabel(key, bucket) {
  if (bucket === 'day') {
    const [y, mo, d] = key.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(y, mo - 1, d));
  }
  if (bucket === 'month') {
    const [y, mo] = key.split('-').map(Number);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(y, mo - 1, 1));
  }
  return key;
}

function allBucketKeys(start, end, bucket) {
  const keys = [];
  const cur = new Date(start);
  if (bucket === 'day') {
    cur.setHours(12, 0, 0, 0);
    const endNoon = new Date(end);
    endNoon.setHours(12, 0, 0, 0);
    while (cur <= endNoon) {
      keys.push(bucketKey(cur, 'day'));
      cur.setDate(cur.getDate() + 1);
    }
  } else if (bucket === 'month') {
    cur.setDate(1);
    cur.setHours(12, 0, 0, 0);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1, 12);
    while (cur <= endMonth) {
      keys.push(bucketKey(cur, 'month'));
      cur.setMonth(cur.getMonth() + 1);
    }
  } else {
    cur.setMonth(0, 1);
    cur.setHours(12, 0, 0, 0);
    const endYear = end.getFullYear();
    while (cur.getFullYear() <= endYear) {
      keys.push(bucketKey(cur, 'year'));
      cur.setFullYear(cur.getFullYear() + 1);
    }
  }
  return keys;
}

export function aggregate(donations, bucket, start, end) {
  const keys = allBucketKeys(start, end, bucket);
  const totals = Object.fromEntries(keys.map((k) => [k, 0]));
  for (const d of donations) {
    if (!d.donation_date) continue;
    const dt = new Date(d.donation_date);
    dt.setHours(12, 0, 0, 0);
    const k = bucketKey(dt, bucket);
    if (k in totals) totals[k] += Number(d.amount) || 0;
  }
  return keys.map((k) => ({
    label: bucketLabel(k, bucket),
    amount: totals[k],
  }));
}

export function formatRangeLabel(start, end) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const s = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  }).format(start);
  const e = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(end);
  return `${s} – ${e}`;
}
