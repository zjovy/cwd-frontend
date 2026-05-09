import { useEffect, useState } from 'react';

import StatCard from '@/common/components/atoms/StatCard';
import dashboardService from '@/services/dashboardService';
import donationService from '@/services/donationService';
import { formatAmount } from '@/utils/format';
import {
  ArrowUpRight,
  CalendarDays,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react';
import PropTypes from 'prop-types';

import { formatRangeLabel, toISODate } from './chartUtils';

const rowStyle = {
  display: 'flex',
  gap: '16px',
};

const PRESET_LABELS = {
  '1w': 'Past 1 Week',
  '2w': 'Past 2 Weeks',
  '1m': 'Past 1 Month',
  '3m': 'Past 3 Months',
  '6m': 'Past 6 Months',
  '1y': 'Past 1 Year',
};

function getPeriodLabel(preset, activeRange) {
  if (preset && preset !== 'custom' && PRESET_LABELS[preset])
    return PRESET_LABELS[preset];
  return formatRangeLabel(activeRange.start, activeRange.end);
}

function FilteredStats({ activeRange, preset, refreshKey }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { start, end } = activeRange;
    donationService
      .getAll(
        { startDate: toISODate(start), endDate: toISODate(end) },
        controller.signal
      )
      .then(({ donations }) => {
        const inRange = donations.filter((d) => {
          if (!d.donation_date) return false;
          const dt = new Date(d.donation_date);
          dt.setHours(12, 0, 0, 0);
          return dt >= start && dt <= end;
        });
        const total = inRange.reduce(
          (sum, d) => sum + (Number(d.amount) || 0),
          0
        );
        setStats({ total, count: inRange.length });
      })
      .catch((err) => {
        if (err.name !== 'AbortError')
          console.error('Failed to fetch range stats:', err);
      });
    return () => controller.abort();
  }, [activeRange, refreshKey]);

  const label = getPeriodLabel(preset, activeRange);

  return (
    <div style={rowStyle}>
      <StatCard
        label={label}
        value={stats ? formatAmount(stats.total) : '—'}
        sub={
          stats ? `${stats.count} donation${stats.count !== 1 ? 's' : ''}` : '—'
        }
        icon={CalendarDays}
      />
    </div>
  );
}

FilteredStats.propTypes = {
  activeRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  preset: PropTypes.string,
  refreshKey: PropTypes.number,
};

FilteredStats.defaultProps = {
  preset: null,
  refreshKey: 0,
};

export default function StatsRow({ refreshKey, rangeInfo }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (rangeInfo.activeRange) return;
    const controller = new AbortController();
    dashboardService
      .getSummary(controller.signal)
      .then((data) => setSummary(data))
      .catch((err) => {
        if (err.name !== 'AbortError')
          console.error('Failed to fetch dashboard summary:', err);
      });
    return () => controller.abort();
  }, [refreshKey, rangeInfo.activeRange]);

  if (rangeInfo.activeRange) {
    return (
      <FilteredStats
        activeRange={rangeInfo.activeRange}
        preset={rangeInfo.preset}
        refreshKey={refreshKey}
      />
    );
  }

  const growthRate = summary?.growth_rate;
  const growthValue =
    growthRate == null ? 'N/A' : `${growthRate > 0 ? '+' : ''}${growthRate}%`;
  const growthColor =
    growthRate == null ? '#9ca3af' : growthRate >= 0 ? '#22c55e' : '#ef4444';

  const stats = [
    {
      label: 'Total Donations',
      value: summary ? formatAmount(summary.total_amount) : '—',
      sub: 'All time donations',
      icon: DollarSign,
    },
    {
      label: 'This Week',
      value: summary ? formatAmount(summary.week_amount) : '—',
      sub: summary ? `${summary.week_count} donations` : '—',
      icon: TrendingUp,
    },
    {
      label: 'Total Donors',
      value: summary ? String(summary.total_donors) : '—',
      sub: 'Active donors',
      icon: Users,
    },
    {
      label: 'Growth Rate',
      value: summary ? growthValue : '—',
      sub: 'vs last month',
      icon: ArrowUpRight,
      iconColor: growthColor,
      valueColor: growthColor,
    },
  ];

  return (
    <div style={rowStyle}>
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}

StatsRow.propTypes = {
  refreshKey: PropTypes.number,
  rangeInfo: PropTypes.shape({
    activeRange: PropTypes.object,
    preset: PropTypes.string,
  }),
};

StatsRow.defaultProps = {
  refreshKey: 0,
  rangeInfo: { activeRange: null, preset: null },
};
