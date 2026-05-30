import { useEffect, useReducer } from 'react';

import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import dashboardService from '@/services/dashboardService';
import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { formatRangeLabel, getEffectiveBucket, toISODate } from './chartUtils';

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

function chartReducer(state, action) {
  switch (action.type) {
    case 'fetch':
      return { data: [], loading: true, error: null };
    case 'success':
      return { data: action.data, loading: false, error: null };
    case 'error':
      return { data: [], loading: false, error: action.error };
    default:
      return state;
  }
}

export default function FilteredChart({
  activeRange,
  bucketOverride,
  refreshKey,
}) {
  const [{ data, loading, error }, dispatch] = useReducer(chartReducer, {
    data: [],
    loading: true,
    error: null,
  });

  const rangeDays = (activeRange.end - activeRange.start) / 86400000;
  const bucket = getEffectiveBucket(rangeDays, bucketOverride);
  const rangeLabel = formatRangeLabel(activeRange.start, activeRange.end);

  useEffect(() => {
    const { start, end } = activeRange;
    const controller = new AbortController();
    dispatch({ type: 'fetch' });
    dashboardService
      .getRangeTrend(
        toISODate(start),
        toISODate(end),
        bucket,
        controller.signal
      )
      .then((data) => {
        dispatch({ type: 'success', data });
      })
      .catch((err) => {
        if (err.name !== 'AbortError')
          dispatch({ type: 'error', error: err.message });
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
          flexWrap: 'wrap',
          gap: '8px',
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
        <div className='responsive-chart-row'>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '6px',
                fontWeight: '500',
              }}
            >
              Trend
            </div>
            <ResponsiveContainer width='100%' height={200}>
              <LineChart
                data={data}
                margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
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
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type='monotone'
                  dataKey='amount'
                  stroke='#3b82f6'
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginBottom: '6px',
                fontWeight: '500',
              }}
            >
              By Period
            </div>
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
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: '#f5f5f4' }}
                />
                <Bar dataKey='amount' fill='#3b82f6' radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
