import { useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import Pagination from '@/common/components/atoms/Pagination';
import DeleteConfirmModal from '@/common/components/organisms/DeleteConfirmModal';
import DonorModal from '@/common/components/organisms/DonorModal';
import DonorTable from '@/common/components/organisms/DonorsTable';
import useDonors from '@/hooks/useDonors';
import { PAGE_SIZE } from '@/utils/pagination';
import { Plus } from 'lucide-react';

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

const INITIAL_FILTERS = { search: ''};

/* ── component ───────────────────────────────────────── */

export default function DonorsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { donors, total, totalPages, loading, error, onPageResetRef, createDonor, updateDonor, deleteDonor } =
    useDonors({ ...filters, page });

  useEffect(() => {
    onPageResetRef.current = () => { setPage(1); setSelected(new Set()); };
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

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (d) => { setEditing(d); setModalOpen(true); };

  const handleSubmit = async (data) => {
    if (editing) {
      await updateDonor(editing.id, data);
    } else {
      await createDonor(data);
    }
  };

  const handleDelete = async () => {
    await deleteDonor(deleting.id);
    setDeleting(null);
  };

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Donors</div>
          <div style={styles.subtitle}>View donor details and contributions in one place.</div>
        </div>
        <button style={styles.addBtn} onClick={openCreate}>
          <Plus size={14} /> Add Donor
        </button>
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
          onEdit={openEdit}
          onDelete={(d) => setDeleting(d)}
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Card>

      <DonorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        donor={editing}
      />

      <DeleteConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        donorName={deleting?.name}
      />
    </main>
  );
}
