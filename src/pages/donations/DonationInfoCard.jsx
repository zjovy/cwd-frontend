/*
  DonationInfoCard
  Displays read-only donation information (donor name, email, phone, address, amount, date, receipt status).
  Reusable component for both DonationDetailsPage and DonationViewModal.

  Props:
    donation - the donation detail object
    donorLink - optional: if true, wraps donor name in a Link to /donors/:id
*/
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Badge from '@/common/components/atoms/Badge';
import { formatAmount, formatDate } from '@/utils/format';

const styles = {
  section: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '20px',
  },
  field: {
    display: 'grid',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  value: {
    fontSize: '16px',
    color: '#111827',
    fontWeight: '500',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
  },
};

export default function DonationInfoCard({ donation, donorLink = false }) {
  if (!donation) return null;

  const donorName = donation.donorFullName || `${donation.first_name} ${donation.last_name}`;

  const donorField = donorLink && donation.donor_id ? (
    <Link to={`/donors/${donation.donor_id}`} style={styles.link}>
      <span style={styles.value}>{donorName}</span>
    </Link>
  ) : (
    <span style={styles.value}>{donorName}</span>
  );

  return (
    <div style={styles.section}>
      <div style={styles.field}>
        <span style={styles.label}>Donor</span>
        {donorField}
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Email</span>
        <span style={styles.value}>{donation.donorEmail || donation.email}</span>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Amount</span>
        <span style={styles.value}>{formatAmount(donation.amount)}</span>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Date</span>
        <span style={styles.value}>{formatDate(donation.donation_date)}</span>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Receipt Status</span>
        <div style={{ paddingTop: '2px' }}>
          <Badge status={donation.receipt_status} />
        </div>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Phone</span>
        <span style={styles.value}>{donation.phone || '—'}</span>
      </div>

      <div style={styles.field}>
        <span style={styles.label}>Address</span>
        <span style={styles.value}>{donation.address || '—'}</span>
      </div>
    </div>
  );
}

DonationInfoCard.propTypes = {
  donation: PropTypes.shape({
    id: PropTypes.number,
    donor_id: PropTypes.number,
    donorFullName: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    donorEmail: PropTypes.string,
    email: PropTypes.string,
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    donation_date: PropTypes.string,
    receipt_status: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  }),
  donorLink: PropTypes.bool,
};
