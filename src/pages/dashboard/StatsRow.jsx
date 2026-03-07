import StatCard from '@/common/components/atoms/StatCard';
import { ArrowUpRight, DollarSign, TrendingUp, Users } from 'lucide-react';

const rowStyle = {
  display: 'flex',
  gap: '16px',
};

const STATS = [
  {
    label: 'Total Donations',
    value: '$6,400',
    sub: 'All time donations',
    icon: DollarSign,
  },
  {
    label: 'This Week',
    value: '$5,350',
    sub: '10 donations',
    icon: TrendingUp,
  },
  { label: 'Total Donors', value: '8', sub: 'Active donors', icon: Users },
  {
    label: 'Growth Rate',
    value: '+12.5%',
    sub: 'vs last month',
    icon: ArrowUpRight,
    iconColor: '#22c55e',
    valueColor: '#22c55e',
  },
];

export default function StatsRow() {
  return (
    <div style={rowStyle}>
      {STATS.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
