import PropTypes from 'prop-types';

const baseStyle = {
  background: '#ffffff',
  border: '1px solid #e8e8e6',
  borderRadius: '12px',
  padding: '22px',
};

export default function Card({ children, style }) {
  return <div style={{ ...baseStyle, ...style }}>{children}</div>;
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

Card.defaultProps = {
  style: {},
};
