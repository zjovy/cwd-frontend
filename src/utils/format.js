export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatAmount(amount) {
  return `$${parseFloat(amount).toLocaleString()}`;
}

export function formatRelativeTime(date) {
  const elapsed = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (elapsed < 60) return 'Just now';
  const mins = Math.floor(elapsed / 60);
  if (elapsed < 3600) return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`;
  const hours = Math.floor(elapsed / 3600);
  if (elapsed < 86400) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  const days = Math.floor(elapsed / 86400);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
}
