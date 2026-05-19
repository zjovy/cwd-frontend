import { useCallback, useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import DonationTable from '@/common/components/organisms/DonationTable';
import DonationViewModal from '@/common/components/organisms/DonationViewModal';
import donationService from '@/services/donationService';
import PropTypes from 'prop-types';

import { parseLocalDate } from './chartUtils';

const dateFilterRow = {
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  marginBottom: '12px',
  flexWrap: 'wrap',
};

const dateLabel = { fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap' };

const dateInput = {
  padding: '5px 8px',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  fontSize: '13px',
  outline: 'none',
  background: '#f9fafb',
};

const clearDateBtn = {
  padding: '5px 10px',
  border: '1px solid #e5e7eb',
  borderRadius: '6px',
  background: '#fff',
  color: '#6b7280',
  fontSize: '12px',
  cursor: 'pointer',
};

export default function RecentDonations({ onMutate }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [viewing, setViewing] = useState(null);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const fetchRecent = useCallback(
    async (signal) => {
      setLoading(true);
      setError(null);
      const params = {};
      if (!dateStart && !dateEnd) params.limit = 5;
      if (dateStart) params.startDate = dateStart;
      if (dateEnd) params.endDate = dateEnd;
      try {
        const data = await donationService.getAll(params, signal);
        let list = data.donations;
        if (dateStart) {
          const startDt = parseLocalDate(dateStart);
          list = list.filter((d) => {
            const dt = parseLocalDate(String(d.donation_date).slice(0, 10));
            return dt >= startDt;
          });
        }
        if (dateEnd) {
          const endDt = parseLocalDate(dateEnd, true);
          list = list.filter((d) => {
            const dt = parseLocalDate(String(d.donation_date).slice(0, 10));
            return dt <= endDt;
          });
        }
        setDonations(list);
        setSelected(new Set());
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [dateStart, dateEnd]
  );

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
    onMutate?.();
  };

  const handleDelete = async (id) => {
    await donationService.delete(id);
    setViewing(null);
    await fetchRecent();
    onMutate?.();
  };

  return (
    <>
      <Card style={{ marginTop: '20px', padding: '24px' }}>
        <SectionTitle>Recent Donations</SectionTitle>

        <div style={dateFilterRow}>
          <span style={dateLabel}>From</span>
          <input
            type='date'
            style={dateInput}
            value={dateStart}
            onChange={(e) => setDateStart(e.target.value)}
          />
          <span style={dateLabel}>To</span>
          <input
            type='date'
            style={dateInput}
            value={dateEnd}
            onChange={(e) => setDateEnd(e.target.value)}
          />
          {(dateStart || dateEnd) && (
            <button
              style={clearDateBtn}
              onClick={() => {
                setDateStart('');
                setDateEnd('');
              }}
            >
              Clear
            </button>
          )}
        </div>

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

RecentDonations.propTypes = {
  onMutate: PropTypes.func,
};

RecentDonations.defaultProps = {
  onMutate: undefined,
};
