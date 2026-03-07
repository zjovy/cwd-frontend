import StatCard from '@/common/components/atoms/StatCard';
import { formatAmount } from '@/utils/format';
import { ArrowUpRight, DollarSign, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  const growthValue = summary?.growth_rate == null
    ? 'N/A'
    : `${summary.growth_rate > 0 ? '+' : ''}${summary.growth_rate}%`;

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
      iconColor: '#22c55e',
      valueColor: '#22c55e',
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
