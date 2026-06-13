/*
  NavItem component
  Used for displaying a navigation item with an icon and a label on the right sidebar

  Props:
    - label (string): The label to display.
    - icon (elementType): The icon to display.
    - active (boolean): Whether the item is active.
    - onClick (function): The function to call when the item is clicked.
    - href (string): When provided, renders an anchor link (e.g. for the docs
      site served outside the SPA) instead of a button.
*/
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

export default function NavItem({ label, icon: Icon, active, onClick, href }) {
  if (href) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        style={{ ...btnStyle(active), textDecoration: 'none' }}
      >
        <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
        {label}
      </a>
    );
  }

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
  href: PropTypes.string,
};

NavItem.defaultProps = {
  active: false,
  onClick: undefined,
  href: undefined,
};
