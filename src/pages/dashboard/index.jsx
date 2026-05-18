import { useMemo, useState } from 'react';

import Button from '@/common/components/atoms/CommonButton';
import { useUser } from '@/common/contexts/UserContext';
import ChartsRow from '@/pages/dashboard/ChartsRow';
import RecentDonations from '@/pages/dashboard/RecentDonations';
import StatsRow from '@/pages/dashboard/StatsRow';
import { RefreshCw } from 'lucide-react';

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
  const [refreshKey, setRefreshKey] = useState(0);
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
