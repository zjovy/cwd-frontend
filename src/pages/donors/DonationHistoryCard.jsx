import Badge from '@/common/components/atoms/Badge';
import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import { formatAmount, formatDate } from '@/utils/format';
import PropTypes from 'prop-types';

const styles = {
  card: { padding: '24px' },
  subtitle: {
    fontSize: '13px',
    color: '#6b7280',
    marginTop: '-14px',
    marginBottom: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f0f0ee',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0ee',
  },
  td: {
    padding: '14px 0',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f9f9f8',
  },
  empty: {
    padding: '40px 0',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },
  totalsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px',
  },
  totalsWrap: {
    textAlign: 'right',
  },
  totalsLabel: { fontSize: '13px', color: '#6b7280' },
  totalsValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#22c55e',
    letterSpacing: '-0.02em',
  },
};

export default function DonationHistoryCard({ donations, loading, error, onRowClick }) {
  const total = donations.reduce(
    (sum, d) => sum + (parseFloat(d.amount) || 0),
    0
  );

  const renderBody = () => {
    if (loading)
      return <div style={styles.empty}>Loading donation history…</div>;
    if (error)
      return (
        <div style={{ ...styles.empty, color: '#dc2626' }}>Error: {error}</div>
      );
    if (donations.length === 0)
      return <div style={styles.empty}>No donations yet.</div>;

    return (
      <>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={{ ...styles.th, textAlign: 'center' }}>Receipt Status</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr
                key={d.id}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
                onClick={onRowClick ? () => onRowClick(d) : undefined}
              >
                <td style={styles.td}>{formatDate(d.donation_date)}</td>
                <td style={{ ...styles.td, textAlign: 'center' }}>
                  <Badge status={d.receipt_status} />
                </td>
                <td
                  style={{ ...styles.td, textAlign: 'right', fontWeight: 500 }}
                >
                  {formatAmount(d.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={styles.totalsRow}>
          <div style={styles.totalsWrap}>
            <div style={styles.totalsLabel}>
              Total from {donations.length} donation
              {donations.length === 1 ? '' : 's'}
            </div>
            <div style={styles.totalsValue}>{formatAmount(total)}</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card style={styles.card}>
      <SectionTitle>Donation History</SectionTitle>
      <div style={styles.subtitle}>
        Complete history of all donations from this donor
      </div>
      {renderBody()}
    </Card>
  );
}

DonationHistoryCard.propTypes = {
  donations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRowClick: PropTypes.func,
};

DonationHistoryCard.defaultProps = {
  error: null,
  onRowClick: null,
};
