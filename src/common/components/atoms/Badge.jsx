import PropTypes from 'prop-types';

const colorMap = {
  sent: { background: '#22c55e', color: '#fff' },
  pending: { background: '#f97316', color: '#fff' },
  failed: { background: '#ef4444', color: '#fff' },
};

const badgeStyle = (status) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: '600',
  ...(colorMap[status] || { background: '#e5e7eb', color: '#374151' }),
});

export default function Badge({ status }) {
  return <span style={badgeStyle(status)}>{status}</span>;
}

Badge.propTypes = {
  status: PropTypes.string.isRequired,
};
