import { useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import Pagination from '@/common/components/atoms/Pagination';
import TableScroll from '@/common/components/atoms/TableScroll';
import DonorTable from '@/common/components/organisms/DonorsTable';
import useDonors from '@/hooks/useDonors';
import { usePageStyles } from '@/common/styles/pageStyles';
import { PAGE_SIZE } from '@/utils/pagination';

import DonorsFilterBar from './DonorsFilterBar';

const INITIAL_FILTERS = { search: '' };

/* ── component ───────────────────────────────────────── */

export default function DonorsPage() {
  const pageStyles = usePageStyles();
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
    <main style={pageStyles.main}>
      <div style={pageStyles.topRow}>
        <div>
          <div style={pageStyles.title}>Donors</div>
          <div style={pageStyles.subtitle}>
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

      <Card style={{ padding: pageStyles.cardPadding, marginTop: '16px' }}>
        <TableScroll>
          <DonorTable
            donors={donors}
            loading={loading}
            error={error}
            selected={selected}
            onSelectChange={handleSelectChange}
            onSelectAll={handleSelectAll}
          />
        </TableScroll>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>
    </main>
  );
}
