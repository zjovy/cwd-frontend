import { useCallback, useEffect, useState } from 'react';

import donationService from '@/services/donationService';
import donorService from '@/services/donorService';

/*
  useDonorDetails
  Loads a donor profile along with the donor's full donation history.

  Donation history is fetched from /donations with a `search` filter that
  matches the donor's email — the donor detail endpoint only returns one
  joined row, so it cannot serve as the history source.
*/
export default function useDonorDetails(id) {
  const [donor, setDonor] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(
    async (signal) => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const detail = await donorService.getById(id, signal);
        setDonor(detail);

        if (detail?.email) {
          const { donations } = await donationService.getAll(
            { search: detail.email, limit: 100 },
            signal
          );
          const ownDonations = donations.filter(
            (d) => d.donor_email === detail.email
          );
          setHistory(ownDonations);
        } else {
          setHistory([]);
        }
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
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

  const updateDonor = async (data) => {
    await donorService.update(id, data);
    await refetch();
  };

  return { donor, history, loading, error, updateDonor, refetch };
}
