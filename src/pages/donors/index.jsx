import { useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import Pagination from '@/common/components/atoms/Pagination';
import DonorTable from '@/common/components/organisms/DonorsTable';
import useDonors from '@/hooks/useDonors';
import { PAGE_SIZE } from '@/utils/pagination';

import DonorsFilterBar from './DonorsFilterBar';

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
};

const INITIAL_FILTERS = { search: '' };

/* ── component ───────────────────────────────────────── */

export default function DonorsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);

  const { donors, total, totalPages, loading, error, onPageResetRef } =
    useDonors({ ...filters, page });

  useEffect(() => {
    onPageResetRef.current = () => {
      setPage(1);
      setSelected(new Set());
    };
  });

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
    setSelected(selectAll ? new Set(donors.map((d) => d.id)) : new Set());

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSelected(new Set());
  };

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Donors</div>
          <div style={styles.subtitle}>
            View donor details and contributions in one place.
          </div>
        </div>
      </div>

      <DonorsFilterBar
        filters={filters}
        onChange={handleFilterChange}
        page={page}
        pageSize={PAGE_SIZE}
        total={loading ? null : total}
      />

      <Card style={{ padding: '24px', marginTop: '16px' }}>
        <DonorTable
          donors={donors}
          loading={loading}
          error={error}
          selected={selected}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>
    </main>
  );
}
