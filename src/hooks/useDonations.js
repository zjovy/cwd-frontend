import { useCallback, useEffect, useRef, useState } from 'react';

import donationService from '@/services/donationService';
import { PAGE_SIZE } from '@/utils/pagination';

export default function useDonations(filters = {}) {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lets mutations re-fetch with the latest filters without stale closures
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  });

  // Callback exposed to the page so it can reset page to 1 after a mutation
  const onPageResetRef = useRef(null);

  const fetchDonations = useCallback(async (params, signal) => {
    setLoading(true);
    setError(null);
    try {
      const { donations: rows, total: count } = await donationService.getAll(
        { ...params, limit: PAGE_SIZE },
        signal
      );
      setDonations(Array.isArray(rows) ? rows : []);
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
  const { search, status, minAmount, maxAmount, page } = filters;
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetchDonations(
        { search, status, minAmount, maxAmount, page },
        controller.signal
      );
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, status, minAmount, maxAmount, page, fetchDonations]);

  const refetchAtPage1 = async () => {
    onPageResetRef.current?.();
    await fetchDonations({ ...filtersRef.current, page: 1 });
  };

  const createDonation = async (data) => {
    await donationService.create(data);
    await refetchAtPage1();
  };

  const updateDonation = async (id, data) => {
    await donationService.update(id, data);
    // Update doesn't change total count — re-fetch at current page
    await fetchDonations(filtersRef.current);
  };

  const deleteDonation = async (id) => {
    await donationService.delete(id);
    // Delete changes total count — go back to page 1 to avoid empty page
    await refetchAtPage1();
  };

  return {
    donations,
    total,
    totalPages: Math.max(0, Math.ceil((Number(total) || 0) / PAGE_SIZE)),
    loading,
    error,
    onPageResetRef,
    createDonation,
    updateDonation,
    deleteDonation,
  };
}
