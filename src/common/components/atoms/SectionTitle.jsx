import PropTypes from 'prop-types';

const titleStyle = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '20px',
};

export default function SectionTitle({ children }) {
  return <div style={titleStyle}>{children}</div>;
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
};
