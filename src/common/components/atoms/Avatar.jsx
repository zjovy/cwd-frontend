import PropTypes from 'prop-types';

const avatarStyle = (size) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  background: '#1a1a1a',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: size * 0.35,
  fontWeight: '600',
  flexShrink: 0,
});

export default function Avatar({ initials, size }) {
  return <div style={avatarStyle(size)}>{initials}</div>;
}

Avatar.propTypes = {
  initials: PropTypes.string.isRequired,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  size: 34,
};
