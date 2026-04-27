import PropTypes from 'prop-types';

import { tableStyle, tdStyle, thStyle, statusMsg } from '@/common/components/atoms/tableStyles';
import ActionsMenu from '@/common/components/molecules/ActionsMenu';
import { useUser } from '@/common/contexts/UserContext';

/* ── styles ─────────────────────────────────────────── */

const badge = (role) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '500',
  background: role !== 'pending' ? '#dcfce7' : '#fee2e2',
  color: role !== 'pending' ? '#166534' : '#991b1b',
});

const adminBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '500',
  background: '#dbeafe',
  color: '#1e40af',
};

/* ── UsersTable ──────────────────────────────────────── */

const COLUMNS = ['Name', 'Email', 'Access', 'Admin', 'Actions'];

function getActions(u, currentUser, { onSetRole }) {
  const isSelf = u.firebaseUid === currentUser?.firebaseUid;

  if (u.role === 'pending') {
    return [
      { label: 'Approve as User', onClick: () => onSetRole(u.firebaseUid, 'member') },
      { label: 'Approve as Admin', onClick: () => onSetRole(u.firebaseUid, 'admin') },
    ];
  }

  return [
    {
      label: 'Revoke Access',
      onClick: () => onSetRole(u.firebaseUid, 'pending'),
      danger: true,
      disabled: isSelf,
    },
    u.role === 'admin'
      ? {
          label: 'Downgrade to User',
          onClick: () => onSetRole(u.firebaseUid, 'member'),
          danger: true,
          disabled: isSelf,
        }
      : { label: 'Make Admin', onClick: () => onSetRole(u.firebaseUid, 'admin') },
  ];
}

export default function UsersTable({ users, loading, onSetRole }) {
  const { user: currentUser } = useUser();

  const getDisplayName = (u) => {
    if (u.firstname && u.lastname) return `${u.firstname} ${u.lastname}`;
    return u.email;
  };

  if (loading) return <div style={statusMsg}>Loading…</div>;

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {COLUMNS.map((h) => (
            <th key={h} style={thStyle}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan={COLUMNS.length} style={statusMsg}>
              No users found.
            </td>
          </tr>
        ) : (
          users.map((u) => (
            <tr key={u.firebaseUid}>
              <td style={{ ...tdStyle, fontWeight: '500', color: '#1a1a1a' }}>
                {getDisplayName(u)}
              </td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>
                <span style={badge(u.role)}>
                  {u.role === 'pending' ? 'Pending' : 'Approved'}
                </span>
              </td>
              <td style={tdStyle}>
                {u.role === 'admin' ? <span style={adminBadge}>Admin</span> : '—'}
              </td>
              <td style={tdStyle}>
                <ActionsMenu actions={getActions(u, currentUser, { onSetRole })} />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

UsersTable.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onSetRole: PropTypes.func.isRequired,
};
