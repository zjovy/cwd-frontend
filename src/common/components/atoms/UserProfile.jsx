import PropTypes from 'prop-types';
import { LogOut } from 'lucide-react';
import Avatar from 'common/components/Avatar';

const styles = {
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #f0f0ee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    marginLeft: '10px',
    flex: 1,
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '1px',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#9ca3af',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.15s',
  },
};

export default function UserProfile({ initials, name, email, onLogout }) {
  return (
    <div style={styles.footer}>
      <Avatar initials={initials} />
      <div style={styles.userInfo}>
        <div style={styles.userName}>{name}</div>
        <div style={styles.userEmail}>{email}</div>
      </div>
      <button style={styles.logoutBtn} title='Sign out' onClick={onLogout}>
        <LogOut size={16} />
      </button>
    </div>
  );
}

UserProfile.propTypes = {
  initials: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onLogout: PropTypes.func,
};

UserProfile.defaultProps = {
  onLogout: undefined,
};
