import { useNavigate, useParams } from 'react-router-dom';

import useDonationDetail from '@/hooks/useDonationDetail';
import donationService from '@/services/donationService';
import DonationViewModal from './DonationViewModal';

const styles = {
  main: {
    flex: 1,
    padding: '36px 40px',
    overflowY: 'auto',
    minHeight: '100vh',
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
  const { donation, loading, error, refetch } = useDonationDetail(id);

  const handleSaveDonation = async (donationId, data) => {
    await donationService.update(donationId, data);
    await refetch();
  };

  const handleDeleteDonation = async (donationId) => {
    await donationService.delete(donationId);
    navigate('/donations');
  };

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
      <DonationViewModal
        open={true}
        onClose={() => navigate(-1)}
        donation={donation}
        onSave={handleSaveDonation}
        onDelete={handleDeleteDonation}
        showOverlay={false}
        closeOnSave={false}
      />
    </main>
  );
}
