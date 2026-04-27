import { Navigate, Outlet } from 'react-router-dom';

import { useUser } from '@/common/contexts/UserContext';

export function PrivateRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) return <Navigate to='/login' replace />;
  if (user.role === 'pending') return <Navigate to='/no-access' replace />;
  return <Outlet />;
}

export function AdminRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user?.role === 'admin' ? <Outlet /> : <Navigate to='/' replace />;
}

export function PublicOnlyRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return !user ? <Outlet /> : <Navigate to='/' replace />;
}
