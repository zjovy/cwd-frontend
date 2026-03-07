import PropTypes from 'prop-types';

const btnStyle = (active) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 12px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: active ? '600' : '400',
  color: active ? '#1a1a1a' : '#6b7280',
  background: active ? '#f5f5f4' : 'transparent',
  cursor: 'pointer',
  border: 'none',
  width: '100%',
  textAlign: 'left',
  transition: 'all 0.15s ease',
  marginBottom: '2px',
});

export default function NavItem({ label, icon: Icon, active, onClick }) {
  return (
    <button style={btnStyle(active)} onClick={onClick}>
      <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
      {label}
    </button>
  );
}

NavItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func,
};

NavItem.defaultProps = {
  active: false,
  onClick: undefined,
};
