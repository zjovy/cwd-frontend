import PropTypes from 'prop-types';

const wrapperStyle = {
  width: '100%',
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
};

export default function TableScroll({ children, style }) {
  return <div style={{ ...wrapperStyle, ...style }}>{children}</div>;
}

TableScroll.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

TableScroll.defaultProps = {
  style: undefined,
};
