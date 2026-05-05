import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import NavBar from '@/common/components/navigation/NavBar';
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
  const hideSidebar = ['/login', '/no-access'].includes(location.pathname);

  const handleNavigate = (pageId) => {
    navigate(`/${pageId}`);
  };

  return (
    <Layout>
      <NavBar />
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
