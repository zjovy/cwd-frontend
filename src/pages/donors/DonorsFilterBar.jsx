/*
  DonorsFilterBar
  Controlled filter row + result count for the Donors page.

  Props:
    filters  – { search, status, minAmount, maxAmount }
    onChange – (field, value) => void
    page     – current page (1-indexed)
    pageSize – rows per page
    total    – total matching records (null while loading)
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

export default function DonorsFilterBar({ filters, onChange, page, pageSize, total }) {
  const { search } = filters;

  const firstItem = total === null ? null : (page - 1) * pageSize + 1;
  const lastItem = total === null ? null : Math.min(page * pageSize, total);

  return (
    <Card style={{ padding: '20px 24px' }}>
      <div style={styles.filterRow}>
        <div style={styles.searchWrap}>
          <Search size={14} style={styles.searchIcon} />
          <input
            style={styles.searchInput}
            placeholder='Search by donor name or email...'
            value={search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>
      </div>

      {total !== null && total > 0 && (
        <div style={styles.count}>
          Showing {firstItem} - {lastItem} of {total} record{total !== 1 ? 's' : ''}
        </div>
      )}
      {total === 0 && (
        <div style={styles.count}>No records found.</div>
      )}
    </Card>
  );
}

DonorsFilterBar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number,
};
