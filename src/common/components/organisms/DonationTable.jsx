/*
  DonationTable — shared table used by both RecentDonations (dashboard) and
  the full Donations page.

  Props:
    donations     – array of donation objects
    loading       – bool
    error         – string | null
    selected      – Set<id>  (controlled by parent)
    onSelectChange – (id) => void   toggles one row
    onSelectAll    – (bool) => void  select / deselect all visible rows
    onEdit        – (donation) => void
    onDelete      – (donation) => void
*/
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Badge from '@/common/components/atoms/Badge';
import { formatAmount, formatDate } from '@/utils/format';
import PropTypes from 'prop-types';

/* ── styles ─────────────────────────────────────────── */

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

const checkboxTh = {
  ...thStyle,
  width: '36px',
};

const tdStyle = {
  padding: '14px 0',
  fontSize: '14px',
  color: '#374151',
  borderBottom: '1px solid #f9f9f8',
};

const checkboxTd = {
  ...tdStyle,
  width: '36px',
};

const statusMsg = {
  padding: '40px 0',
  textAlign: 'center',
  fontSize: '14px',
  color: '#6b7280',
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

const donorLinkStyle = {
  color: '#1a1a1a',
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  transition: 'border-color 0.15s',
};

/* ── ActionsMenu ─────────────────────────────────────── */

function ActionsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <span style={{ position: 'relative' }}>
      <button style={actionsBtnStyle} onClick={() => setOpen((v) => !v)}>
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

ActionsMenu.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

/* ── DonationTable ───────────────────────────────────── */

const COLUMNS = [
  'Donor Name',
  'Email',
  'Amount',
  'Date',
  'Receipt Status',
  'Actions',
];

export default function DonationTable({
  donations,
  loading,
  error,
  selected,
  onSelectChange,
  onSelectAll,
  onEdit,
  onDelete,
}) {
  const allChecked =
    donations.length > 0 && donations.every((d) => selected.has(d.id));
  const someChecked = donations.some((d) => selected.has(d.id));

  const selectAllRef = useRef(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someChecked && !allChecked;
    }
  }, [someChecked, allChecked]);

  if (loading) return <div style={statusMsg}>Loading donations…</div>;
  if (error)
    return <div style={{ ...statusMsg, color: '#dc2626' }}>Error: {error}</div>;

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          <th style={checkboxTh}>
            <input
              type='checkbox'
              ref={selectAllRef}
              checked={allChecked}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </th>
          {COLUMNS.map((h) => (
            <th key={h} style={thStyle}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {donations.length === 0 ? (
          <tr>
            <td colSpan={COLUMNS.length + 1} style={statusMsg}>
              No donations found.
            </td>
          </tr>
        ) : (
          donations.map((d) => (
            <tr key={d.id}>
              <td style={checkboxTd}>
                <input
                  type='checkbox'
                  checked={selected.has(d.id)}
                  onChange={() => onSelectChange(d.id)}
                />
              </td>
              <td style={{ ...tdStyle, fontWeight: '500', color: '#1a1a1a' }}>
                {d.donor_id ? (
                  <Link to={`/donors/${d.donor_id}`} style={donorLinkStyle}>
                    {d.donor_name}
                  </Link>
                ) : (
                  d.donor_name
                )}
              </td>
              <td style={tdStyle}>{d.donor_email}</td>
              <td style={tdStyle}>{formatAmount(d.amount)}</td>
              <td style={tdStyle}>{formatDate(d.donation_date)}</td>
              <td style={tdStyle}>
                <Badge status={d.receipt_status} />
              </td>
              <td style={tdStyle}>
                <ActionsMenu
                  onEdit={() => onEdit(d)}
                  onDelete={() => onDelete(d)}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

DonationTable.propTypes = {
  donations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  selected: PropTypes.instanceOf(Set).isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
