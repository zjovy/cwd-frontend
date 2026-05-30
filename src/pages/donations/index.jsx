import { useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import Pagination from '@/common/components/atoms/Pagination';
import TableScroll from '@/common/components/atoms/TableScroll';
import DonationModal from '@/common/components/organisms/DonationModal';
import DonationTable from '@/common/components/organisms/DonationTable';
import useDonations from '@/hooks/useDonations';
import { usePageStyles } from '@/common/styles/pageStyles';
import { PAGE_SIZE } from '@/utils/pagination';
import { Plus } from 'lucide-react';

import DonationViewModal from '@/common/components/organisms/DonationViewModal';
import DonationsFilterBar from './DonationsFilterBar';

/* ── styles ─────────────────────────────────────────── */

const styles = {
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
  const pageStyles = usePageStyles();
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
    refetchDonations,
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
    <main style={pageStyles.main}>
      <div style={pageStyles.topRow}>
        <div>
          <div style={pageStyles.title}>Donations</div>
          <div style={pageStyles.subtitle}>
            View and manage all donation records.
          </div>
        </div>
        <button style={styles.addBtn} onClick={openCreate}>
          <Plus size={14} color='white' /> Add Donation
        </button>
      </div>

      <DonationsFilterBar
        filters={filters}
        onChange={handleFilterChange}
        page={page}
        pageSize={PAGE_SIZE}
        total={loading ? null : total}
      />

      <Card style={{ padding: pageStyles.cardPadding, marginTop: '16px' }}>
        <TableScroll>
          <DonationTable
            donations={donations}
            loading={loading}
            error={error}
            selected={selected}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
            onRowClick={(d) => setViewing(d)}
          />
        </TableScroll>

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
        onReceiptSent={refetchDonations}
      />
    </main>
  );
}
