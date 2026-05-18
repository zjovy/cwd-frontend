import { useCallback, useEffect, useState } from 'react';
import donationService from '@/services/donationService';

/*
  useDonationDetail
  Loads a single donation detail record (with donor info, contact fields, etc.)

  Returns: { donation, loading, error, refetch }
*/
export default function useDonationDetail(id) {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(
    async (signal) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const detail = await donationService.getById(id, signal);
        setDonation(detail);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load donation details.');
        }
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    const controller = new AbortController();
    refetch(controller.signal);
    return () => controller.abort();
  }, [refetch]);

  return { donation, loading, error, refetch };
}
