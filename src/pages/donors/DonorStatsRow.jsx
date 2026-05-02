import StatCard from '@/common/components/atoms/StatCard';
import { formatAmount } from '@/utils/format';
import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import PropTypes from 'prop-types';

const rowStyle = {
  display: 'flex',
  gap: '16px',
  marginBottom: '20px',
};

function formatMemberSince(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function yearsActive(date) {
  if (!date) return '';
  const start = new Date(date);
  const now = new Date();
  const years = Math.max(
    0,
    Math.floor((now - start) / (365.25 * 24 * 3600 * 1000))
  );
  if (years === 0) return 'less than a year active';
  return `${years} year${years === 1 ? '' : 's'} active`;
}

export default function DonorStatsRow({
  totalDonated,
  memberSince,
  totalDonations,
}) {
  return (
    <div style={rowStyle}>
      <StatCard
        label='Total Donated'
        value={formatAmount(totalDonated || 0)}
        sub='Lifetime contribution'
        icon={DollarSign}
        iconColor='#22c55e'
        valueColor='#22c55e'
      />
      <StatCard
        label='Member Since'
        value={formatMemberSince(memberSince)}
        sub={yearsActive(memberSince)}
        icon={Calendar}
        iconColor='#2563eb'
      />
      <StatCard
        label='Total Donations'
        value={String(totalDonations ?? 0)}
        sub='Completed donations'
        icon={TrendingUp}
        iconColor='#f97316'
        valueColor='#f97316'
      />
    </div>
  );
}

DonorStatsRow.propTypes = {
  totalDonated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  memberSince: PropTypes.string,
  totalDonations: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
