/*
  DonationsFilterBar
  Controlled filter row + result count for the Donations page.

  Props:
    filters  – { search, status, minAmount, maxAmount }
    onChange – (field, value) => void
    count    – number | null (null while loading)
*/

import Card from '@/common/components/atoms/Card';
import { Search } from 'lucide-react';
import PropTypes from 'prop-types';

const styles = {
  filterRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: '12px',
  },
  searchWrap: {
    flex: '1 1 220px',
    position: 'relative',
    minWidth: '180px',
  },
  searchIcon: {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 32px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f9fafb',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    background: '#f9fafb',
    cursor: 'pointer',
    minWidth: '130px',
  },
  amountInput: {
    width: '120px',
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '13px',
    outline: 'none',
    background: '#f9fafb',
  },
  count: {
    fontSize: '13px',
    color: '#6b7280',
  },
};

export default function DonationsFilterBar({ filters, onChange, count }) {
  const { search, status, minAmount, maxAmount } = filters;

  return (
    <Card style={{ padding: '20px 24px' }}>
      <div style={styles.filterRow}>
        <div style={styles.searchWrap}>
          <Search size={14} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder='Search by name or email...'
            value={search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>
        <select
          style={styles.select}
          value={status}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <option value=''>All Status</option>
          <option value='sent'>Sent</option>
          <option value='pending'>Pending</option>
        </select>
        <input
          style={styles.amountInput}
          type='number'
          placeholder='Min Amount'
          min='0'
          value={minAmount}
          onChange={(e) => onChange('minAmount', e.target.value)}
        />
        <input
          style={styles.amountInput}
          type='number'
          placeholder='Max Amount'
          min='0'
          value={maxAmount}
          onChange={(e) => onChange('maxAmount', e.target.value)}
        />
      </div>

      {count !== null && (
        <div style={styles.count}>
          Showing {count} donation{count !== 1 ? 's' : ''}
        </div>
      )}
    </Card>
  );
}

DonationsFilterBar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    minAmount: PropTypes.string.isRequired,
    maxAmount: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  count: PropTypes.number,
};
