import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import Button from '@/common/components/atoms/CommonButton';
import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import donationService from '@/services/donationService';
import { formatAmount, formatDate } from '@/utils/format';

const styles = {
  main: {
    flex: 1,
    padding: '36px 40px',
    overflowY: 'auto',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    marginBottom: '24px',
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#1a1a1a',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  card: {
    padding: '24px',
    minWidth: 0,
  },
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
  message: {
    padding: '40px 0',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },
};

export default function DonationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    donationService
      .getById(id, controller.signal)
      .then((detail) => setDonation(detail))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load donation details.');
          console.error('[DonationDetailsPage] fetch failed:', err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main style={styles.main}>
        <div style={styles.message}>Loading donation details…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.main}>
        <div style={{ ...styles.message, color: '#dc2626' }}>{error}</div>
      </main>
    );
  }

  if (!donation) {
    return (
      <main style={styles.main}>
        <div style={styles.message}>Donation not found.</div>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <Button variant='outline' onClick={() => navigate(-1)}>
          <ArrowLeft size={14} strokeWidth={2} />
          Back
        </Button>
        <div style={styles.titleBlock}>
          <div style={styles.title}>Donation Details</div>
          <div style={styles.subtitle}>View the full donation record.</div>
        </div>
      </div>

      <Card style={styles.card}>
        <SectionTitle>Donation Information</SectionTitle>
        <div style={styles.section}>
          <div style={styles.field}>
            <span style={styles.label}>Donor</span>
            {donation.donor_id ? (
              <Link to={`/donors/${donation.donor_id}`} style={styles.link}>
                <span style={styles.value}>{donation.donorFullName}</span>
              </Link>
            ) : (
              <span style={styles.value}>{donation.donorFullName}</span>
            )}
          </div>

          <div style={styles.field}>
            <span style={styles.label}>Email</span>
            <span style={styles.value}>{donation.donorEmail}</span>
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
            <span style={styles.label}>Receipt status</span>
            <span style={styles.value}>{donation.receipt_status}</span>
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
      </Card>
    </main>
  );
}
