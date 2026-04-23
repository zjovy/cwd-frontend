import { useUser } from '@/common/contexts/UserContext';
import { ShieldOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#f5f5f4',
    padding: '40px',
    textAlign: 'center',
  },
  icon: {
    color: '#9ca3af',
    marginBottom: '20px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '10px',
    letterSpacing: '-0.02em',
  },
  message: {
    fontSize: '14px',
    color: '#6b7280',
    maxWidth: '360px',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  logoutBtn: {
    padding: '9px 20px',
    border: 'none',
    borderRadius: '8px',
    background: '#1a1a1a',
    color: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default function NoAccess() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={styles.container}>
      <ShieldOff size={40} style={styles.icon} />
      <div style={styles.title}>Access Restricted</div>
      <div style={styles.message}>
        You don&apos;t have access to this platform. Please request approval
        from an admin.
      </div>
      <button style={styles.logoutBtn} onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}
