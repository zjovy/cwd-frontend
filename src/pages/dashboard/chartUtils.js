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
