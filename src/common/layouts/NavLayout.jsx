import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Sidebar from '@/common/components/organisms/Sidebar';
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
`;

export default function NavLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage = location.pathname.replace('/', '') || 'dashboard';
  const authPaths = ['/login', '/signup', '/forgot-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  const hideSidebar = isAuthPage || location.pathname === '/no-access';

  const handleNavigate = (pageId) => {
    navigate(`/${pageId}`);
  };

  return (
    <Layout>
      {!isAuthPage}
      <Body>
        {!hideSidebar && (
          <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        )}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </Body>
    </Layout>
  );
}
