/*
  Sidebar component
  Used for displaying the sidebar with the navigation items and the user profile.

  Props:
    - activePage (string): The active page.
    - onNavigate (function): The function to call when the navigation item is clicked.
    - isOpen (bool): Whether the drawer is visible (mobile/tablet).
    - isCompact (bool): Whether the layout uses the collapsible drawer mode.
    - onClose (function): Close the drawer (mobile/tablet).
*/
import { useNavigate } from 'react-router-dom';

import NavItem from '@/common/components/atoms/NavItem';
import UserProfile from '@/common/components/molecules/UserProfile';
import { useUser } from '@/common/contexts/UserContext';
import {
  BookOpen,
  DollarSign,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from 'lucide-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Donations', icon: DollarSign, id: 'donations' },
  { label: 'Donors', icon: Users, id: 'donors' },
  { label: 'Admin', icon: ShieldCheck, id: 'admin', adminOnly: true },
  { label: 'Docs', icon: BookOpen, href: '/docs/', adminOnly: true },
];

const SidebarAside = styled.aside`
  width: 260px;
  min-width: 260px;
  background: #ffffff;
  border-right: 1px solid #e8e8e6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  height: 100%;

  @media (max-width: 1023px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 200;
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: transform 0.25s ease;
    box-shadow: ${({ $isOpen }) =>
      $isOpen ? '4px 0 24px rgba(0, 0, 0, 0.12)' : 'none'};
  }
`;

const LogoSection = styled.div`
  padding: 28px 24px 20px;
  border-bottom: 1px solid #f0f0ee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const Logo = styled.img`
  height: 52px;
  width: auto;
  display: block;
`;

const CloseButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e8e8e6;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  flex-shrink: 0;

  @media (max-width: 1023px) {
    display: flex;
  }

  &:hover {
    background: #f9fafb;
  }
`;

const Nav = styled.nav`
  padding: 16px 12px;
  flex: 1;
  overflow-y: auto;
`;

function getInitials(user) {
  if (user?.firstname && user?.lastname) {
    return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
  }
  if (user?.email) return user.email.slice(0, 2).toUpperCase();
  return '?';
}

function getDisplayName(user) {
  if (user?.firstname && user?.lastname)
    return `${user.firstname} ${user.lastname}`;
  return user?.email || '';
}

export default function Sidebar({
  activePage,
  onNavigate,
  isOpen,
  isCompact,
  onClose,
}) {
  const { user, logout } = useUser();
  const navItems = NAV_ITEMS.filter(
    ({ adminOnly }) => !adminOnly || user?.role === 'admin'
  );
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleNavClick = (id) => {
    onNavigate?.(id);
    if (isCompact) onClose?.();
  };

  return (
    <SidebarAside $isOpen={isOpen} aria-hidden={isCompact && !isOpen}>
      <div>
        <LogoSection>
          <Logo src='/logo.png' alt='C&W Market' />
          {isCompact && (
            <CloseButton type='button' onClick={onClose} aria-label='Close menu'>
              <X size={18} strokeWidth={2} />
            </CloseButton>
          )}
        </LogoSection>
        <Nav>
          {navItems.map(({ label, icon, id, href }) => (
            <NavItem
              key={id || href}
              label={label}
              icon={icon}
              href={href}
            active={!href && activePage === id}
              onClick={href ? undefined : () => handleNavClick(id)}
            />
          ))}
        </Nav>
      </div>
      <UserProfile
        initials={getInitials(user)}
        name={getDisplayName(user)}
        email={user?.email || ''}
        onLogout={handleLogout}
      />
    </SidebarAside>
  );
}

Sidebar.propTypes = {
  activePage: PropTypes.string,
  onNavigate: PropTypes.func,
  isOpen: PropTypes.bool,
  isCompact: PropTypes.bool,
  onClose: PropTypes.func,
};

Sidebar.defaultProps = {
  activePage: 'dashboard',
  onNavigate: undefined,
  isOpen: true,
  isCompact: false,
  onClose: undefined,
};
