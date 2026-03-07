import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
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

const rowStyle = {
  display: 'flex',
  gap: '20px',
  marginTop: '20px',
};

const tooltipStyle = {
  background: '#1a1a1a',
  color: '#fff',
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '600',
};

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div style={tooltipStyle}>
        <div>{label}</div>
        <div>${payload[0].value.toLocaleString()}</div>
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

CustomTooltip.defaultProps = {
  active: false,
  payload: [],
  label: '',
};

export default function ChartsRow() {
  const [trendData, setTrendData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/trend`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setTrendData(data))
      .catch((err) => console.error('Failed to fetch trend data:', err));

    fetch(`${import.meta.env.VITE_BACKEND_URL}/dashboard/last6months`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setMonthlyData(data))
      .catch((err) => console.error('Failed to fetch monthly data:', err));
  }, []);

  return (
    <div style={rowStyle}>
      <Card style={{ flex: 1, padding: '22px 22px 16px' }}>
        <SectionTitle>Donation Trend</SectionTitle>
        <ResponsiveContainer width='100%' height={200}>
          <LineChart
            data={trendData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0ee'
              vertical={false}
            />
            <XAxis
              dataKey='year'
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
              cursor={{ stroke: '#e8e8e6', strokeWidth: 1 }}
            />
            <Line
              type='monotone'
              dataKey='amount'
              stroke='#3b82f6'
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card style={{ flex: 1, padding: '22px 22px 16px' }}>
        <SectionTitle>Last 6 Months</SectionTitle>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart
            data={monthlyData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0ee'
              vertical={false}
            />
            <XAxis
              dataKey='month'
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
      </Card>
    </div>
  );
}
