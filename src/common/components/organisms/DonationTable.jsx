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
    onRowClick    – (donation) => void
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

const donorLinkStyle = {
  color: '#1a1a1a',
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  transition: 'border-color 0.15s',
};

/* ── DonationRow ─────────────────────────────────────── */

function DonationRow({ d, selected, onSelectChange, onRowClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <tr
      style={{
        cursor: 'pointer',
        background: hovered ? '#f5f5f3' : 'transparent',
        transition: 'background 0.1s',
      }}
      onClick={() => onRowClick(d)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={checkboxTd} onClick={(e) => e.stopPropagation()}>
        <input
          type='checkbox'
          checked={selected.has(d.id)}
          onChange={() => onSelectChange(d.id)}
        />
      </td>
      <td style={{ ...tdStyle, fontWeight: '500', color: '#1a1a1a' }}>
        {d.donor_id ? (
          <Link
            to={`/donors/${d.donor_id}`}
            style={donorLinkStyle}
            onClick={(e) => e.stopPropagation()}
          >
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
    </tr>
  );
}

DonationRow.propTypes = {
  d: PropTypes.object.isRequired,
  selected: PropTypes.instanceOf(Set).isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onRowClick: PropTypes.func.isRequired,
};

/* ── DonationTable ───────────────────────────────────── */

const COLUMNS = ['Donor Name', 'Email', 'Amount', 'Date', 'Receipt Status'];

export default function DonationTable({
  donations,
  loading,
  error,
  selected,
  onSelectChange,
  onSelectAll,
  onRowClick,
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
            <DonationRow
              key={d.id}
              d={d}
              selected={selected}
              onSelectChange={onSelectChange}
              onRowClick={onRowClick}
            />
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
  onRowClick: PropTypes.func.isRequired,
};
