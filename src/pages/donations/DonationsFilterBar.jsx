/*
  DonationsFilterBar
  Controlled filter row + result count for the Donations page.

  Props:
    filters  – { search, status, minAmount, maxAmount, startDate, endDate }
    onChange – (field, value) => void
    page     – current page (1-indexed)
    pageSize – rows per page
    total    – total matching records (null while loading)
*/
import Card from '@/common/components/atoms/Card';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import { FileText, Search } from 'lucide-react';
import PropTypes from 'prop-types';

const inputBase = {
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '13px',
  outline: 'none',
  background: '#f9fafb',
  boxSizing: 'border-box',
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  row: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchWrap: {
    flex: '1 1 200px',
    position: 'relative',
    minWidth: 0,
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
    ...inputBase,
    width: '100%',
    paddingLeft: '32px',
  },
  select: {
    ...inputBase,
    cursor: 'pointer',
    flex: '0 1 140px',
    minWidth: '120px',
  },
  pairGroup: {
    display: 'flex',
    gap: '8px',
    flex: '1 1 220px',
    minWidth: 0,
    alignItems: 'center',
  },
  pairInput: {
    ...inputBase,
    flex: 1,
    minWidth: 0,
    width: 0,
  },
  dateLabel: {
    fontSize: '13px',
    color: '#6b7280',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  count: {
    fontSize: '13px',
    color: '#6b7280',
  },
};

export default function DonationsFilterBar({
  filters,
  onChange,
  page,
  pageSize,
  total,
}) {
  const { isMobile } = useBreakpoint();
  const {
    search,
    status,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    descriptionSearch,
  } = filters;

  const firstItem = total === null ? null : (page - 1) * pageSize + 1;
  const lastItem = total === null ? null : Math.min(page * pageSize, total);

  return (
    <Card style={{ padding: isMobile ? '16px' : '20px 24px' }}>
      <div style={styles.container}>
        <div style={styles.row}>
          <div style={styles.searchWrap}>
            <Search size={14} style={styles.searchIcon} />
            <input
              style={styles.searchInput}
              placeholder='Search by name or email...'
              value={search}
              onChange={(e) => onChange('search', e.target.value)}
            />
          </div>
          <div style={styles.searchWrap}>
            <FileText size={14} style={styles.searchIcon} />
            <input
              style={styles.searchInput}
              placeholder='Filter by description...'
              aria-label='Filter by description'
              value={descriptionSearch}
              onChange={(e) => onChange('descriptionSearch', e.target.value)}
            />
          </div>
        </div>

        <div style={styles.row}>
          <select
            style={{
              ...styles.select,
              ...(isMobile ? { flex: '1 1 100%' } : {}),
            }}
            value={status}
            onChange={(e) => onChange('status', e.target.value)}
          >
            <option value=''>All Status</option>
            <option value='sent'>Sent</option>
            <option value='pending'>Pending</option>
          </select>

          <div
            style={{
              ...styles.pairGroup,
              ...(isMobile ? { flex: '1 1 100%' } : {}),
            }}
            aria-label='Amount range'
          >
            <input
              style={styles.pairInput}
              type='number'
              placeholder='Min Amount'
              aria-label='Minimum amount'
              min='0'
              value={minAmount}
              onChange={(e) => onChange('minAmount', e.target.value)}
            />
            <input
              style={styles.pairInput}
              type='number'
              placeholder='Max Amount'
              aria-label='Maximum amount'
              min='0'
              value={maxAmount}
              onChange={(e) => onChange('maxAmount', e.target.value)}
            />
          </div>

          <div
            style={{
              ...styles.pairGroup,
              ...(isMobile ? { flex: '1 1 100%' } : {}),
            }}
            aria-label='Date range'
          >
            <span style={styles.dateLabel}>From</span>
            <input
              style={styles.pairInput}
              type='date'
              aria-label='Start date'
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => onChange('startDate', e.target.value)}
            />
            <span style={styles.dateLabel}>To</span>
            <input
              style={styles.pairInput}
              type='date'
              aria-label='End date'
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => onChange('endDate', e.target.value)}
            />
          </div>
        </div>

        {total !== null && total > 0 && (
          <div style={styles.count}>
            Showing {firstItem}–{lastItem} of {total} donation
            {total !== 1 ? 's' : ''}
          </div>
        )}
        {total === 0 && <div style={styles.count}>No donations found.</div>}
      </div>
    </Card>
  );
}

DonationsFilterBar.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    minAmount: PropTypes.string.isRequired,
    maxAmount: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
    descriptionSearch: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number,
};
