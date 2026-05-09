import { useEffect, useState } from 'react';

import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import donationService from '@/services/donationService';
import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  aggregate,
  formatRangeLabel,
  getEffectiveBucket,
  toISODate,
} from './chartUtils';

const tooltipStyle = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '13px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

const tooltipLabelStyle = {
  color: '#6b7280',
  fontWeight: '500',
  marginBottom: '2px',
};
const tooltipValueStyle = {
  color: '#1a1a1a',
  fontWeight: '700',
  fontSize: '14px',
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length && payload[0].value != null) {
    return (
      <div style={tooltipStyle}>
        <div style={tooltipLabelStyle}>{label}</div>
        <div style={tooltipValueStyle}>
          ${Number(payload[0].value).toLocaleString()}
        </div>
      </div>
    );
  }
  return null;
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

CustomTooltip.defaultProps = { active: false, payload: [], label: '' };

export default function FilteredChart({
  activeRange,
  bucketOverride,
  refreshKey,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { start, end } = activeRange;
  const rangeDays = (end - start) / 86400000;
  const bucket = getEffectiveBucket(rangeDays, bucketOverride);
  const rangeLabel = formatRangeLabel(start, end);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
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
        setData(aggregate(inRange, bucket, start, end));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [activeRange, bucket, refreshKey]);

  return (
    <Card style={{ padding: '22px 22px 16px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <SectionTitle>Donation Trend</SectionTitle>
        <span style={{ fontSize: '13px', color: '#6b7280' }}>{rangeLabel}</span>
      </div>
      {error ? (
        <div style={{ color: '#dc2626', padding: '20px', textAlign: 'center' }}>
          Failed to load chart data: {error}
        </div>
      ) : loading ? (
        <div style={{ height: 200 }} />
      ) : (
        <ResponsiveContainer width='100%' height={200}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0ee'
              vertical={false}
            />
            <XAxis
              dataKey='label'
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f5f5f4' }} />
            <Bar dataKey='amount' fill='#3b82f6' radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

FilteredChart.propTypes = {
  activeRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  bucketOverride: PropTypes.string,
  refreshKey: PropTypes.number,
};

FilteredChart.defaultProps = {
  bucketOverride: 'auto',
  refreshKey: 0,
};
