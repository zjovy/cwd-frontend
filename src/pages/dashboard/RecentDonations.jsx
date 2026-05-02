import { useCallback, useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import DeleteConfirmModal from '@/common/components/organisms/DeleteConfirmModal';
import DonationModal from '@/common/components/organisms/DonationModal';
import DonationTable from '@/common/components/organisms/DonationTable';
import donationService from '@/services/donationService';
import { Plus } from 'lucide-react';

const headerRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '4px',
};

const addBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 14px',
  border: '1px solid #e8e8e6',
  borderRadius: '8px',
  background: '#fff',
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151',
  cursor: 'pointer',
};

export default function RecentDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchRecent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/dashboard/recent-donations`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setDonations(await res.json());
      setSelected(new Set());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecent();
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

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (d) => {
    setEditing(d);
    setModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (editing) {
      await donationService.update(editing.id, data);
    } else {
      await donationService.create(data);
    }
    await fetchRecent();
  };

  const handleDelete = async () => {
    await donationService.delete(deleting.id);
    setDeleting(null);
    await fetchRecent();
  };

  return (
    <>
      <Card style={{ marginTop: '20px', padding: '24px' }}>
        <div style={headerRow}>
          <SectionTitle>Recent Donations</SectionTitle>
          <button style={addBtn} onClick={openCreate}>
            <Plus size={14} /> Add Donation
          </button>
        </div>

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
    </>
  );
}
