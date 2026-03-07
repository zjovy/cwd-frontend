import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import { trendData, weekData } from '@/utils/chartData';
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
              dataKey='week'
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
        <SectionTitle>Last 7 Days</SectionTitle>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart
            data={weekData}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barSize={28}
          >
            <CartesianGrid
              strokeDasharray='3 3'
              stroke='#f0f0ee'
              vertical={false}
            />
            <XAxis
              dataKey='day'
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
