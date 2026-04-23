import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';

import { tableStyle, tdStyle, thStyle, statusMsg } from '@/common/components/atoms/tableStyles';
import Badge from '@/common/components/atoms/Badge';
import ActionsMenu from '@/common/components/molecules/ActionsMenu';
import { formatAmount, formatDate } from '@/utils/format';

const clickableRowStyle = { cursor: 'pointer' };

/* ── styles ─────────────────────────────────────────── */

const checkboxTh = {
  ...thStyle,
  width: '36px',
};

const checkboxTd = {
  ...tdStyle,
  width: '36px',
};

/* ── DonorTable ───────────────────────────────────── */

const COLUMNS = [
  'Name',
  'Email',
  'Address',
  'Phone',
  'Total Donations',
  'Donation Count',
  'Most Recent',
  'Actions',
];

function addressCell(d) {
  if (d.address != null && String(d.address).trim()) return d.address;
  return '—';
}

export default function DonorTable({
  donors,
  loading,
  error,
  selected,
  onSelectChange,
  onSelectAll,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();
  const allChecked =
    donors.length > 0 && donors.every((d) => selected.has(d.id));
  const someChecked = donors.some((d) => selected.has(d.id));

  const selectAllRef = useRef(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someChecked && !allChecked;
    }
  }, [someChecked, allChecked]);

  if (loading) return <div style={statusMsg}>Loading donors…</div>;
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
        {donors.length === 0 ? (
          <tr>
            <td colSpan={COLUMNS.length + 1} style={statusMsg}>
              No donations found.
            </td>
          </tr>
        ) : (
          donors.map((d) => (
            <tr
              key={d.id}
              style={clickableRowStyle}
              onClick={() => navigate(`/donors/${d.id}`)}
            >
              <td style={checkboxTd} onClick={(e) => e.stopPropagation()}>
                <input
                  type='checkbox'
                  checked={selected.has(d.id)}
                  onChange={() => onSelectChange(d.id)}
                />
              </td>
              <td style={{ ...tdStyle, fontWeight: '500', color: '#1a1a1a' }}>
                {d.name}
              </td>
              <td style={tdStyle}>{d.email}</td>
              <td style={tdStyle}>{addressCell(d)}</td>
              <td style={tdStyle}>{d.phone}</td>
              <td style={tdStyle}>{formatAmount(d.total_donations)}</td>
              <td style={tdStyle}>{d.donation_count}</td>
              <td style={tdStyle}>{formatDate(d.most_recent)}</td>
              <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
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

DonorTable.propTypes = {
  donors: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  selected: PropTypes.instanceOf(Set).isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onSelectAll: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
