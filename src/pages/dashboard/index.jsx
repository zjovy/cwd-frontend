import { useEffect, useMemo, useState } from 'react';

import Button from '@/common/components/atoms/CommonButton';
import { usePageStyles } from '@/common/styles/pageStyles';
import { useUser } from '@/common/contexts/UserContext';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import ChartsRow from '@/pages/dashboard/ChartsRow';
import RecentDonations from '@/pages/dashboard/RecentDonations';
import StatsRow from '@/pages/dashboard/StatsRow';
import dashboardService from '@/services/dashboardService';
import { formatRelativeTime } from '@/utils/format';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

import DateRangeFilter from './DateRangeFilter';
import { parseLocalDate } from './chartUtils';

const DAYS_MAP = {
  '1w': 7,
  '2w': 14,
  '1m': 30,
  '3m': 90,
  '6m': 180,
  '1y': 365,
};

const styles = {
  lastSynced: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
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
  const pageStyles = usePageStyles();
  const { isMobile } = useBreakpoint();
  const { user } = useUser();
  const firstName = user?.firstname || 'there';
  const [refreshKey, setRefreshKey] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [preset, setPreset] = useState(null);
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [bucketOverride, setBucketOverride] = useState('auto');

  const activeRange = useMemo(() => {
    if (!preset) return null;
    if (preset === 'custom') {
      if (!customStart || !customEnd) return null;
      return {
        start: parseLocalDate(customStart),
        end: parseLocalDate(customEnd, true),
      };
    }
    const e = new Date();
    e.setHours(23, 59, 59, 999);
    const s = new Date();
    s.setDate(s.getDate() - (DAYS_MAP[preset] - 1));
    s.setHours(0, 0, 0, 0);
    return { start: s, end: e };
  }, [preset, customStart, customEnd]);

  const rangeDays = activeRange
    ? (activeRange.end - activeRange.start) / 86400000
    : null;

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
    // 5 min — Stripe sync can take a while when pulling full history (e.g. first
    // run after a truncate). Backend-side processing governs the real deadline;
    // this just prevents the request from hanging indefinitely on network issues.
    const timeoutId = setTimeout(() => controller.abort(), 5 * 60 * 1000);
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

  const handlePresetChange = (p) => {
    setPreset(p);
    setBucketOverride('auto');
  };

  const handleClear = () => {
    setPreset(null);
    setCustomStart('');
    setCustomEnd('');
    setBucketOverride('auto');
  };

  const handleMutate = () => setRefreshKey((k) => k + 1);

  return (
    <main style={pageStyles.main}>
      <div style={pageStyles.topRow}>
        <div>
          <div style={pageStyles.title}>Dashboard</div>
          <div style={pageStyles.subtitle}>
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
            <div
              style={{
                ...styles.lastSynced,
                textAlign: isMobile ? 'left' : 'right',
              }}
            >
              Last synced {formatRelativeTime(lastSyncedAt)}
            </div>
          )}
        </div>
      </div>

      <DateRangeFilter
        preset={preset}
        onPresetChange={handlePresetChange}
        onClear={handleClear}
        customStart={customStart}
        customEnd={customEnd}
        onCustomChange={(field, value) =>
          field === 'start' ? setCustomStart(value) : setCustomEnd(value)
        }
        bucketOverride={bucketOverride}
        onBucketChange={setBucketOverride}
        rangeDays={rangeDays}
      />
      <StatsRow refreshKey={refreshKey} rangeInfo={{ activeRange, preset }} />
      <ChartsRow
        refreshKey={refreshKey}
        activeRange={activeRange}
        bucketOverride={bucketOverride}
      />
      <RecentDonations onMutate={handleMutate} />
    </main>
  );
}
