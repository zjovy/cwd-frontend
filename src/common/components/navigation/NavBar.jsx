import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/common/components/atoms/CommonButton';
import { useUser } from '@/common/contexts/UserContext';
import styled from 'styled-components';

import LogoutModal from './LogoutModal';

const StyledNav = styled.nav`
  display: flex;
  gap: 10px;
  padding: 10px 20px;
  font-size: 20px;
`;

const LeftAligned = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
`;

const LogoPlaceholder = styled(Button.Invisible)`
  padding: 0;
  font-size: 1.7rem;
  font-weight: bold;
  font-family: monospace;
`;

export default function NavBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogoutClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setIsModalOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <StyledNav>
      <LeftAligned>
        <LogoPlaceholder onClick={() => navigate('/')}>[LOGO]</LogoPlaceholder>
      </LeftAligned>
      {user ? (
        <Button.Secondary onClick={handleLogoutClick}>Log Out</Button.Secondary>
      ) : (
        <>
          <Button.Primary onClick={() => navigate('/signup')}>
            Sign Up
          </Button.Primary>
          <Button.Secondary onClick={() => navigate('/login')}>
            Login
          </Button.Secondary>
        </>
      )}
      <LogoutModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onLogout={handleLogoutConfirm}
      />
    </StyledNav>
  );
}
