import { useEffect, useState } from 'react';

import Button from '@/common/components/atoms/CommonButton';
import { useUser } from '@/common/contexts/UserContext';
import ChartsRow from '@/pages/dashboard/ChartsRow';
import RecentDonations from '@/pages/dashboard/RecentDonations';
import StatsRow from '@/pages/dashboard/StatsRow';
import dashboardService from '@/services/dashboardService';
import { formatRelativeTime } from '@/utils/format';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

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
  lastSynced: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
    textAlign: 'right',
  },
  toastList: {
    margin: '6px 0 4px',
    paddingLeft: '16px',
    fontSize: '12px',
  },
  toastCode: {
    fontFamily: 'monospace',
    fontSize: '11px',
  },
  toastPrompt: {
    margin: '8px 0 0',
    fontSize: '12px',
    opacity: 0.8,
  },
};

export default function DashboardPage() {
  const { user } = useUser();
  const firstName = user?.firstname || 'there';
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);

  const fetchLastSync = async () => {
    try {
      const { synced_at } = await dashboardService.getLastSync();
      setLastSyncedAt(synced_at);
    } catch {
      // informational only — fail silently
    }
  };

  useEffect(() => {
    fetchLastSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSyncStripe = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30_000);
    setSyncing(true);
    try {
      const {
        inserted = 0,
        skipped: _skipped = 0,
        errors = [],
      } = (await dashboardService.syncStripe(controller.signal)) ?? {};
      if (errors.length > 0) {
        toast.error(
          <div>
            <strong>Partial sync — {errors.length} payment(s) failed</strong>
            <ul style={styles.toastList}>
              {errors.map((e) => (
                <li key={e.stripe_id}>
                  <span style={styles.toastCode}>{e.stripe_id}</span> —{' '}
                  {e.message}
                </li>
              ))}
            </ul>
            <p style={styles.toastPrompt}>
              Please add these donations manually in the Donations tab.
            </p>
            {inserted > 0 && (
              <p style={styles.toastPrompt}>
                {inserted} payment(s) synced successfully.
              </p>
            )}
          </div>,
          { duration: Infinity }
        );
      } else {
        toast.success(`Synced ${inserted} payment(s)`);
      }
      if (inserted > 0) {
        setRefreshKey((k) => k + 1);
      }
      await fetchLastSync();
    } catch (err) {
      toast.error('Sync failed — try again');
      console.error('Stripe sync error:', err);
    } finally {
      clearTimeout(timeoutId);
      setSyncing(false);
    }
  };

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>Dashboard</div>
          <div style={styles.subtitle}>
            {`Welcome back ${firstName}! Here's an overview of your C&W Foundation donor activity.`}
          </div>
        </div>
        <div>
          <Button
            variant='outline'
            onClick={handleSyncStripe}
            disabled={syncing}
          >
            <RefreshCw
              size={14}
              strokeWidth={2}
              aria-hidden='true'
              style={
                syncing ? { animation: 'spin 1s linear infinite' } : undefined
              }
            />
            {syncing ? 'Syncing…' : 'Refresh Stripe'}
          </Button>
          {lastSyncedAt && (
            <div style={styles.lastSynced}>
              Last synced {formatRelativeTime(lastSyncedAt)}
            </div>
          )}
        </div>
      </div>

      <StatsRow refreshKey={refreshKey} />
      <ChartsRow refreshKey={refreshKey} />
      <RecentDonations refreshKey={refreshKey} />
    </main>
  );
}
