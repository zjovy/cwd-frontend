/*
  Badge component
  Used for displaying a status of a thank you letter sent to a donar.
  Either "sent" or "pending".

  Props:
    - status (string): The status to display.
*/
import PropTypes from 'prop-types';

const colorMap = {
  sent: { background: '#00A63E', color: '#fff' },
  pending: { background: '#FF8040', color: '#fff' },
};

const badgeStyle = (status) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '500',
  ...(colorMap[status] || { background: '#e5e7eb', color: '#374151' }),
});

export default function Badge({ status }) {
  return <span style={badgeStyle(status)}>{status}</span>;
}

Badge.propTypes = {
  status: PropTypes.string.isRequired,
};
