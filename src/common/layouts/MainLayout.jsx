import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';

import Sidebar from 'common/components/Sidebar';

const layoutStyle = {
  display: 'flex',
  minHeight: '100vh',
  background: '#f5f5f4',
};

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const activePage = location.pathname.replace('/', '') || 'dashboard';

  const handleNavigate = (pageId) => {
    navigate(`/${pageId}`);
  };

  return (
    <div style={layoutStyle}>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <Outlet />
    </div>
  );
}

MainLayout.propTypes = {};
