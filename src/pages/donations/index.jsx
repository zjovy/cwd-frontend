import { useState } from 'react';

import Card from '@/common/components/atoms/Card';
import DeleteConfirmModal from '@/common/components/organisms/DeleteConfirmModal';
import DonationModal from '@/common/components/organisms/DonationModal';
import DonationTable from '@/common/components/organisms/DonationTable';
import useDonations from '@/hooks/useDonations';
import { Plus } from 'lucide-react';

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

const INITIAL_FILTERS = { search: '', status: '', minAmount: '', maxAmount: '' };

/* ── component ───────────────────────────────────────── */

export default function DonationsPage() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selected, setSelected] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { donations, loading, error, createDonation, updateDonation, deleteDonation } =
    useDonations(filters);

  const handleFilterChange = (field, value) =>
    setFilters((prev) => ({ ...prev, [field]: value }));

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

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (d) => { setEditing(d); setModalOpen(true); };

  const handleSubmit = async (data) => {
    if (editing) {
      await updateDonation(editing.id, data);
    } else {
      await createDonation(data);
    }
  };

  const handleDelete = async () => {
    await deleteDonation(deleting.id);
    setDeleting(null);
  };

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Donations</div>
          <div style={styles.subtitle}>View and manage all donation records.</div>
        </div>
        <button style={styles.addBtn} onClick={openCreate}>
          <Plus size={14} /> Add Donation
        </button>
      </div>

      <DonationsFilterBar
        filters={filters}
        onChange={handleFilterChange}
        count={loading ? null : donations.length}
      />

      <Card style={{ padding: '24px', marginTop: '16px' }}>
        <DonationTable
          donations={donations}
          loading={loading}
          error={error}
          selected={selected}
          onSelectChange={handleSelectChange}
          onSelectAll={handleSelectAll}
          onEdit={openEdit}
          onDelete={(d) => setDeleting(d)}
        />
      </Card>

      <DonationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        donation={editing}
      />

      <DeleteConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        donorName={deleting?.donor_name}
      />
    </main>
  );
}
