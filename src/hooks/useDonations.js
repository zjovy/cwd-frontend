import { useCallback, useEffect, useState } from 'react';

import donationService from '@/services/donationService';

export default function useDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const createDonation = async (data) => {
    await donationService.create(data);
    await fetchDonations();
  };

  const updateDonation = async (id, data) => {
    await donationService.update(id, data);
    await fetchDonations();
  };

  const deleteDonation = async (id) => {
    await donationService.delete(id);
    await fetchDonations();
  };

  return {
    donations,
    loading,
    error,
    refresh: fetchDonations,
    createDonation,
    updateDonation,
    deleteDonation,
  };
}
