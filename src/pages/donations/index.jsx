import { useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import Pagination from '@/common/components/atoms/Pagination';
import DonationModal from '@/common/components/organisms/DonationModal';
import DonationTable from '@/common/components/organisms/DonationTable';
import useDonations from '@/hooks/useDonations';
import { PAGE_SIZE } from '@/utils/pagination';
import { Plus } from 'lucide-react';

import DonationViewModal from './DonationViewModal';
import DonationsFilterBar from './DonationsFilterBar';

/* ── styles ─────────────────────────────────────────── */

const styles = {
  main: {
    flex: 1,
    padding: '36px 40px',
    overflowY: 'auto',
    minHeight: '100vh',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '9px 16px',
    border: 'none',
    borderRadius: '8px',
    background: '#2563eb',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

const INITIAL_FILTERS = {
  search: '',
  status: '',
  minAmount: '',
  maxAmount: '',
};

/* ── component ───────────────────────────────────────── */

export default function DonationsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [viewing, setViewing] = useState(null);

  const {
    donations,
    total,
    totalPages,
    loading,
    error,
    onPageResetRef,
    createDonation,
    updateDonation,
    deleteDonation,
  } = useDonations({ ...filters, page });

  // Give the hook a way to reset the page to 1 after create/delete
  useEffect(() => {
    onPageResetRef.current = () => {
      setPage(1);
      setSelected(new Set());
    };
  });

  // Reset to page 1 whenever a filter value changes
  const handleFilterChange = (field, value) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAll = (selectAll) =>
    setSelected(selectAll ? new Set(donations.map((d) => d.id)) : new Set());

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelected(new Set());
  };

  const openCreate = () => setModalOpen(true);

  const handleCreate = async (data) => {
    await createDonation(data);
  };

  const handleDelete = async (id) => {
    await deleteDonation(id);
    setViewing(null);
  };

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Donations</div>
          <div style={styles.subtitle}>
            View and manage all donation records.
          </div>
        </div>
        <button style={styles.addBtn} onClick={openCreate}>
          <Plus size={14} /> Add Donation
        </button>
      </div>

      <DonationsFilterBar
        filters={filters}
        onChange={handleFilterChange}
        page={page}
        pageSize={PAGE_SIZE}
        total={loading ? null : total}
      />

      <Card style={{ padding: '24px', marginTop: '16px' }}>
        <DonationTable
          donations={donations}
          loading={loading}
          error={error}
          selected={selected}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          onRowClick={(d) => setViewing(d)}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>

      <DonationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
      />

      <DonationViewModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        donation={viewing}
        onSave={updateDonation}
        onDelete={handleDelete}
      />
    </main>
  );
}
