import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import MobileHeader from '@/common/components/navigation/MobileHeader';
import Sidebar from '@/common/components/organisms/Sidebar';
import { useBreakpoint } from '@/hooks/useMediaQuery';
import styled from 'styled-components';

const Layout = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  background: #f5f5f4;
  position: relative;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  min-width: 0;
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 150;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export default function NavLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isCompact } = useBreakpoint();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activePage = location.pathname.replace('/', '') || 'dashboard';
  const authPaths = ['/login', '/signup', '/forgot-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  const hideSidebar = isAuthPage || location.pathname === '/no-access';

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isCompact) setSidebarOpen(false);
  }, [isCompact]);

  useEffect(() => {
    if (!sidebarOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sidebarOpen]);

  const handleNavigate = (pageId) => {
    navigate(`/${pageId}`);
  };

  const showMobileHeader = !hideSidebar && isCompact;

  return (
    <Layout>
      {showMobileHeader && (
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      )}
      <Body>
        {!hideSidebar && (
          <>
            {isCompact && sidebarOpen && (
              <Backdrop
                onClick={() => setSidebarOpen(false)}
                aria-hidden='true'
              />
            )}
            <Sidebar
              activePage={activePage}
              onNavigate={handleNavigate}
              isOpen={!isCompact || sidebarOpen}
              isCompact={isCompact}
              onClose={() => setSidebarOpen(false)}
            />
          </>
        )}
        <Content>
          <Outlet />
        </Content>
      </Body>
    </Layout>
  );
}
