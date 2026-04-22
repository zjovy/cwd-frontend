/*
  Avatar component
  Used for displaying user initials or profile pictures in a circular frame located on the right sidebar

  Props:
    - initials (string): The initials to display.
    - size (number, optional): The diameter of the avatar in pixels. Defaults to 34.
*/
import PropTypes from 'prop-types';

const avatarStyle = (size) => ({
  width: size,
  height: size,
  borderRadius: '50%',
  background: '#E5E7EB',
  color: '#0A0A0A',
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
