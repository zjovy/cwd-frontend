import { useEffect, useState } from 'react';

import StatCard from '@/common/components/atoms/StatCard';
import { formatAmount } from '@/utils/format';
import { ArrowUpRight, DollarSign, TrendingUp, Users } from 'lucide-react';

const rowStyle = {
  display: 'flex',
  gap: '16px',
};

export default function StatsRow() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/summary`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setSummary(data))
      .catch((err) => console.error('Failed to fetch dashboard summary:', err));
  }, []);

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
