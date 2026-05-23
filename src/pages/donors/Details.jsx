import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '@/common/components/atoms/CommonButton';
import useDonorDetails from '@/hooks/useDonorDetails';
import donationService from '@/services/donationService';
import { ArrowLeft } from 'lucide-react';

import DonationViewModal from '../donations/DonationViewModal';
import ContactInfoCard from './ContactInfoCard';
import DonationHistoryCard from './DonationHistoryCard';
import DonorEditModal from './DonorEditModal';
import DonorStatsRow from './DonorStatsRow';

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
    marginBottom: '20px',
  },
  titleBlock: { flex: 1 },
  name: {
    fontSize: '32px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#1a1a1a',
    lineHeight: 1.1,
    marginBottom: '4px',
  },
  subtitle: { fontSize: '14px', color: '#6b7280', marginBottom: '12px' },
  tagRow: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '999px',
    background: '#fff',
    border: '1px solid #e8e8e6',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
  },
  status: {
    padding: '40px 0',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },
};

function deriveTags(donor, history) {
  if (!donor) return [];
  const tags = [];
  const count = history.length;
  const total = history.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0);

  if (count >= 5) tags.push('Monthly Donor');
  if (total >= 1000) tags.push('Major Donor');
  return tags;
}

function earliestDonationDate(history) {
  if (!history.length) return null;
  return history
    .reduce((min, d) => {
      const cur = new Date(d.donation_date);
      return !min || cur < min ? cur : min;
    }, null)
    ?.toISOString();
}

export default function DonorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donor, history, loading, error, updateDonor, refetch } = useDonorDetails(id);
  const [editOpen, setEditOpen] = useState(false);
  const [viewing, setViewing] = useState(null);

  const tags = useMemo(() => deriveTags(donor, history), [donor, history]);
  const memberSince = useMemo(() => earliestDonationDate(history), [history]);
  const historyTotal = useMemo(
    () => history.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0),
    [history]
  );

  if (loading && !donor) {
    return (
      <main style={styles.main}>
        <div style={styles.status}>Loading donor…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main style={styles.main}>
        <div style={{ ...styles.status, color: '#dc2626' }}>Error: {error}</div>
      </main>
    );
  }

  if (!donor) {
    return (
      <main style={styles.main}>
        <div style={styles.status}>Donor not found.</div>
      </main>
    );
  }

  const handleUpdateDonation = async (donationId, data) => {
    await donationService.update(donationId, data);
    await refetch();
  };

  const handleDeleteDonation = async (donationId) => {
    await donationService.delete(donationId);
    setViewing(null);
    await refetch();
  };

  return (
    <main style={styles.main}>
      <div style={styles.header}>
        <Button variant='outline' onClick={() => navigate(-1)}>
          <ArrowLeft size={14} strokeWidth={2} />
          Back
        </Button>
        <div style={styles.titleBlock}>
          <div style={styles.name}>{donor.fullName}</div>
          <div style={styles.subtitle}>Donor Profile</div>
          <div style={styles.tagRow}>
            {tags.map((t) => (
              <span key={t} style={styles.tag}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <DonorStatsRow
        totalDonated={historyTotal}
        memberSince={memberSince}
        totalDonations={history.length}
      />

      <ContactInfoCard
        email={donor.email}
        phone={donor.phone}
        address={donor.address}
        onEdit={() => setEditOpen(true)}
      />

      <DonationHistoryCard
        donations={history}
        loading={loading}
        error={error}
        onRowClick={(d) => setViewing(d)}
      />

      <DonorEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={updateDonor}
        donor={donor}
      />

      <DonationViewModal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        donation={viewing}
        onSave={handleUpdateDonation}
        onDelete={handleDeleteDonation}
        onReceiptSent={refetch}
      />
    </main>
  );
}
