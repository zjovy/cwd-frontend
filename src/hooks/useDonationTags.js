import { useState } from 'react';

const KEY = 'donation_tags';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}');
  } catch {
    return {};
  }
}

export default function useDonationTags() {
  const [map, setMap] = useState(load);

  const getTags = (id) => map[String(id)] ?? [];

  const addTag = (id, tag) => {
    const t = tag.trim();
    if (!t) return;
    setMap((prev) => {
      const k = String(id);
      const cur = prev[k] ?? [];
      if (cur.includes(t)) return prev;
      const next = { ...prev, [k]: [...cur, t] };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  const removeTag = (id, tag) => {
    setMap((prev) => {
      const k = String(id);
      const filtered = (prev[k] ?? []).filter((t) => t !== tag);
      const next = { ...prev };
      if (filtered.length === 0) delete next[k];
      else next[k] = filtered;
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  };

  return { getTags, addTag, removeTag };
}
