import { useCallback, useEffect, useRef, useState } from 'react';

import donationService from '@/services/donationService';

export default function useDonations(filters = {}) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep a ref so mutations can always re-fetch with the latest filters
  // without needing them as effect dependencies
  const filtersRef = useRef(filters);
  useEffect(() => { filtersRef.current = filters; });

  const fetchDonations = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const data = await donationService.getAll(params);
      setDonations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce filter-driven fetches; destructure to avoid firing on every
  // render when the parent creates a new filters object each time
  const { search, status, minAmount, maxAmount } = filters;
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDonations({ search, status, minAmount, maxAmount });
    }, 300);
    return () => clearTimeout(timer);
  }, [search, status, minAmount, maxAmount, fetchDonations]);

  const createDonation = async (data) => {
    await donationService.create(data);
    await fetchDonations(filtersRef.current);
  };

  const updateDonation = async (id, data) => {
    await donationService.update(id, data);
    await fetchDonations(filtersRef.current);
  };

  const deleteDonation = async (id) => {
    await donationService.delete(id);
    await fetchDonations(filtersRef.current);
  };

  return {
    donations,
    loading,
    error,
    createDonation,
    updateDonation,
    deleteDonation,
  };
}
