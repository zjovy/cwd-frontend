import { useCallback, useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import DonationTable from '@/common/components/organisms/DonationTable';
import donationService from '@/services/donationService';

import DonationViewModal from '../donations/DonationViewModal';

export default function RecentDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [viewing, setViewing] = useState(null);

  const fetchRecent = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await donationService.getAll({ limit: 5 }, signal);
      setDonations(data.donations);
      setSelected(new Set());
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchRecent(controller.signal);
    return () => controller.abort();
  }, [fetchRecent]);

  const handleSelectChange = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (selectAll) => {
    setSelected(selectAll ? new Set(donations.map((d) => d.id)) : new Set());
  };

  const handleUpdate = async (id, data) => {
    await donationService.update(id, data);
    await fetchRecent();
  };

  const handleDelete = async (id) => {
    await donationService.delete(id);
    setViewing(null);
    await fetchRecent();
  };

  return (
    <>
      <Card style={{ marginTop: '20px', padding: '24px' }}>
        <SectionTitle>Recent Donations</SectionTitle>

        <DonationTable
          donations={donations}
          loading={loading}
          error={error}
          selected={selected}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          onRowClick={(d) => setViewing(d)}
        />
      </Card>

      <DonationViewModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        donation={viewing}
        onSave={handleUpdate}
        onDelete={handleDelete}
      />
    </>
  );
}
