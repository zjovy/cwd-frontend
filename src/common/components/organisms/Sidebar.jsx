/*
  Sidebar component
  Used for displaying the sidebar with the navigation items and the user profile.

  Props:
    - activePage (string): The active page.
    - onNavigate (function): The function to call when the navigation item is clicked.
*/

import NavItem from '@/common/components/atoms/NavItem';
import UserProfile from '@/common/components/molecules/UserProfile';
import { useUser } from '@/common/contexts/UserContext';
import { DollarSign, LayoutDashboard, ShieldCheck, Users } from 'lucide-react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Donations', icon: DollarSign, id: 'donations' },
  { label: 'Donors', icon: Users, id: 'donors' },
  { label: 'Admin', icon: ShieldCheck, id: 'admin' },
];

const styles = {
  sidebar: {
    width: '260px',
    minWidth: '260px',
    background: '#ffffff',
    borderRight: '1px solid #e8e8e6',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'auto',
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

function getInitials(user) {
  if (user?.firstname && user?.lastname) {
    return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
  }
  if (user?.email) return user.email.slice(0, 2).toUpperCase();
  return '?';
}

function getDisplayName(user) {
  if (user?.firstname && user?.lastname) return `${user.firstname} ${user.lastname}`;
  return user?.email || '';
}

export default function Sidebar({ activePage, onNavigate }) {
  const { user, logout } = useUser();
  const navItems = NAV_ITEMS.filter(({ id }) => id !== 'admin' || user?.role === 'admin');
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoText}>Donor Management</span>
      </div>
      <nav style={styles.nav}>
        {navItems.map(({ label, icon, id }) => (
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
        initials={getInitials(user)}
        name={getDisplayName(user)}
        email={user?.email || ''}
        onLogout={handleLogout}
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
