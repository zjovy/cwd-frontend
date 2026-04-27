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
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import { tableStyle, tdStyle, thStyle, statusMsg } from '@/common/components/atoms/tableStyles';
import Badge from '@/common/components/atoms/Badge';
import ActionsMenu from '@/common/components/molecules/ActionsMenu';
import { formatAmount, formatDate } from '@/utils/format';

/* ── styles ─────────────────────────────────────────── */

const checkboxTh = {
  ...thStyle,
  width: '36px',
};

const checkboxTd = {
  ...tdStyle,
  width: '36px',
};

const donorLinkStyle = {
  color: '#1a1a1a',
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  transition: 'border-color 0.15s',
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
                  actions={[
                    { label: 'Edit', onClick: () => onEdit(d) },
                    { label: 'Delete', onClick: () => onDelete(d), danger: true },
                  ]}
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
