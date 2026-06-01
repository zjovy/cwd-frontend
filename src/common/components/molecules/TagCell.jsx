import PropTypes from 'prop-types';

const chip = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '500',
  background: '#eff6ff',
  color: '#1d4ed8',
  maxWidth: '180px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export default function TagCell({ description }) {
  if (!description) return null;
  return <span style={chip}>{description}</span>;
}

TagCell.propTypes = {
  description: PropTypes.string,
};
