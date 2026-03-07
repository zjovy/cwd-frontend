import PropTypes from 'prop-types';
import { LayoutDashboard, DollarSign, Users } from 'lucide-react';
import NavItem from 'common/components/NavItem';
import UserProfile from 'common/components/UserProfile';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Donations', icon: DollarSign, id: 'donations' },
  { label: 'Donors', icon: Users, id: 'donors' },
];

const styles = {
  sidebar: {
    width: '260px',
    minWidth: '260px',
    background: '#ffffff',
    borderRight: '1px solid #e8e8e6',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  logo: {
    padding: '28px 24px 20px',
    borderBottom: '1px solid #f0f0ee',
  },
  logoText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: '-0.01em',
  },
  nav: {
    padding: '16px 12px',
    flex: 1,
  },
};

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoText}>Donor Management</span>
      </div>
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ label, icon, id }) => (
          <NavItem
            key={id}
            label={label}
            icon={icon}
            active={activePage === id}
            onClick={() => onNavigate && onNavigate(id)}
          />
        ))}
      </nav>
      <UserProfile
        initials='AD'
        name='Clarence Weaver'
        email='cwfoundation1960@gmail.com'
      />
    </aside>
  );
}

Sidebar.propTypes = {
  activePage: PropTypes.string,
  onNavigate: PropTypes.func,
};

Sidebar.defaultProps = {
  activePage: 'dashboard',
  onNavigate: undefined,
};
