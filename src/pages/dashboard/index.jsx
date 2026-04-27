import Button from '@/common/components/atoms/CommonButton';
import { useUser } from '@/common/contexts/UserContext';
import ChartsRow from '@/pages/dashboard/ChartsRow';
import RecentDonations from '@/pages/dashboard/RecentDonations';
import StatsRow from '@/pages/dashboard/StatsRow';
import { RefreshCw } from 'lucide-react';

const styles = {
  main: {
    flex: 1,
    padding: '36px 40px',
    overflowY: 'auto',
    minHeight: '100vh',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
};

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstname || 'there';

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Dashboard</div>
          <div style={styles.subtitle}>
            {`Welcome back ${firstName}! Here's an overview of your C&W Foundation donor activity.`}
          </div>
        </div>
        <Button variant='outline'>
          <RefreshCw size={14} strokeWidth={2} />
          Refresh Stripe
        </Button>
      </div>

      <StatsRow />
      <ChartsRow />
      <RecentDonations />
    </main>
  );
}
