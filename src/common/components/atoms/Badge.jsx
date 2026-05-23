/*
  Badge component
  Used for displaying a status of a thank you letter sent to a donar.
  Either "sent" or "pending".

  Props:
    - status (string): The status to display.
*/
import PropTypes from 'prop-types';

const colorMap = {
  sent: { background: '#F0FDF4', color: '#15803D' },
  pending: { background: '#FFF4E5', color: '#B25000' },
  expired: { background: '#F3F4F6', color: '#6B7280' },
};

const badgeStyle = (status) => ({
  display: 'inline-flex',
  alignItems: 'center',

  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '500',
  letterSpacing: '0.02em',
  ...(colorMap[status] || { background: '#F3F4F6', color: '#374151' }),
});

const label = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : '—';

export default function Badge({ status }) {
  return (
    <span style={badgeStyle(status)}>{label(status)}</span>
  );
}

Badge.propTypes = {
  status: PropTypes.string,
};
