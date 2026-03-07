import { useRef, useState } from 'react';

import Badge from '@/common/components/atoms/Badge';
import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import useDonations from '@/hooks/useDonations';
import { Plus } from 'lucide-react';

import DeleteConfirmModal from './DeleteConfirmModal';
import DonationModal from './DonationModal';

/* ── styles ───────────────────────────────────────── */

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  paddingBottom: '12px',
  borderBottom: '1px solid #f0f0ee',
};

const tdStyle = {
  padding: '14px 0',
  fontSize: '14px',
  color: '#374151',
  borderBottom: '1px solid #f9f9f8',
};

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

const actionsBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '18px',
  letterSpacing: '2px',
  padding: '0 4px',
  lineHeight: 1,
  position: 'relative',
};

const menuStyle = {
  position: 'absolute',
  right: 0,
  top: '100%',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,.1)',
  zIndex: 10,
  minWidth: '120px',
  overflow: 'hidden',
};

const menuItem = {
  display: 'block',
  width: '100%',
  padding: '8px 14px',
  fontSize: '13px',
  color: '#374151',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
};

const menuItemDanger = {
  ...menuItem,
  color: '#dc2626',
};

const statusMsg = {
  padding: '40px 0',
  textAlign: 'center',
  fontSize: '14px',
  color: '#6b7280',
};

const HEADERS = ['Name', 'Amount', 'Date', 'Receipt Status', 'Actions'];

/* ── helpers ──────────────────────────────────────── */

function formatCurrency(value) {
  return Number(value).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* ── ActionsMenu (per-row) ────────────────────────── */

function ActionsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <span ref={ref} style={{ position: 'relative' }}>
      <button style={actionsBtnStyle} onClick={toggle}>
        ···
      </button>
      {open && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9 }}
            onClick={close}
          />
          <div style={menuStyle}>
            <button
              style={menuItem}
              onClick={() => {
                close();
                onEdit();
              }}
            >
              Edit
            </button>
            <button
              style={menuItemDanger}
              onClick={() => {
                close();
                onDelete();
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </span>
  );
}

/* ── main component ───────────────────────────────── */

export default function RecentDonations() {
  const { donations, loading, error, createDonation, updateDonation, deleteDonation } =
    useDonations();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  /* create / edit handlers */
  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (d) => {
    setEditing(d);
    setModalOpen(true);
  };
  const handleSubmit = (data) =>
    editing ? updateDonation(editing.id, data) : createDonation(data);

  /* delete handlers */
  const openDelete = (d) => setDeleting(d);
  const handleDelete = () => deleteDonation(deleting.id);

  return (
    <>
      <Card style={{ marginTop: '20px', padding: '24px' }}>
        <div style={headerRow}>
          <SectionTitle>Recent Donations</SectionTitle>
          <button style={addBtn} onClick={openCreate}>
            <Plus size={14} /> Add Donation
          </button>
        </div>

        {loading && <div style={statusMsg}>Loading donations…</div>}
        {error && <div style={{ ...statusMsg, color: '#dc2626' }}>Error: {error}</div>}

        {!loading && !error && (
          <table style={tableStyle}>
            <thead>
              <tr>
                {HEADERS.map((h) => (
                  <th key={h} style={thStyle}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 ? (
                <tr>
                  <td colSpan={HEADERS.length} style={statusMsg}>
                    No donations found.
                  </td>
                </tr>
              ) : (
                donations.map((d) => (
                  <tr key={d.id}>
                    <td style={{ ...tdStyle, fontWeight: '500', color: '#1a1a1a' }}>
                      {d.donor_name}
                    </td>
                    <td style={tdStyle}>{formatCurrency(d.amount)}</td>
                    <td style={tdStyle}>{formatDate(d.donation_date)}</td>
                    <td style={tdStyle}>
                      <Badge status={d.receipt_status} />
                    </td>
                    <td style={tdStyle}>
                      <ActionsMenu
                        onEdit={() => openEdit(d)}
                        onDelete={() => openDelete(d)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </Card>

      {/* Create / Edit modal */}
      <DonationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        donation={editing}
      />

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        donorName={deleting?.donor_name}
      />
    </>
  );
}
