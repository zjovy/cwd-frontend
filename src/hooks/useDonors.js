import { useCallback, useEffect, useRef, useState } from 'react';

import donorService from '@/services/donorService';
import { PAGE_SIZE } from '@/utils/pagination';

export default function useDonors(filters = {}) {
  const [donors, setDonors] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lets mutations re-fetch with the latest filters without stale closures
  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; });

  // Callback exposed to the page so it can reset page to 1 after a mutation
  const onPageResetRef = useRef(null);

  const fetchDonors = useCallback(async (params, signal) => {
    setLoading(true);
    setError(null);
    try {
      const { donors: rows, total: count } = await donorService.getAll(
        { ...params, limit: PAGE_SIZE },
        signal
      );
      setDonors(Array.isArray(rows) ? rows : []);
      setTotal(typeof count === 'number' && Number.isFinite(count) ? count : 0);
    } catch (err) {
      // AbortError is expected when a newer request cancels this one — ignore it
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      // Only clear loading if this request wasn't aborted
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  // Debounced, cancellable fetch whenever filters change
  const { search, page } = filters;
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchDonors({ search, page }, controller.signal);
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, page, fetchDonors]);

  const refetchAtPage1 = async () => {
    onPageResetRef.current?.();
    await fetchDonors({ ...filtersRef.current, page: 1 });
  };

  const createDonor = async (data) => {
    await donorService.create(data);
    await refetchAtPage1();
  };

  const updateDonor = async (id, data) => {
    await donorService.update(id, data);
    // Update doesn't change total count — re-fetch at current page
    await fetchDonors(filtersRef.current);
  };

  const deleteDonor = async (id) => {
    await donorService.delete(id);
    // Delete changes total count — go back to page 1 to avoid empty page
    await refetchAtPage1();
  };

  return {
    donors,
    total,
    totalPages: Math.max(0, Math.ceil((Number(total) || 0) / PAGE_SIZE)),
    loading,
    error,
    onPageResetRef,
    createDonor,
    updateDonor,
    deleteDonor,
  };
}
