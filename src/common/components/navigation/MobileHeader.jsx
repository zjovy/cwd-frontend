import { Menu } from 'lucide-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Header = styled.header`
  display: none;

  @media (max-width: 1023px) {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #ffffff;
    border-bottom: 1px solid #e8e8e6;
    flex-shrink: 0;
  }
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #e8e8e6;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    background: #f9fafb;
  }
`;

const Logo = styled.img`
  height: 36px;
  width: auto;
  display: block;
`;

export default function MobileHeader({ onMenuClick }) {
  return (
    <Header>
      <MenuButton type='button' onClick={onMenuClick} aria-label='Open menu'>
        <Menu size={20} strokeWidth={2} />
      </MenuButton>
      <Logo src='/logo.png' alt='C&W Market' />
    </Header>
  );
}

MobileHeader.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};
