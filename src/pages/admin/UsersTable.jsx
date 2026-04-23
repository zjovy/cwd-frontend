import PropTypes from 'prop-types';

import { tableStyle, tdStyle, thStyle, statusMsg } from '@/common/components/atoms/tableStyles';
import ActionsMenu from '@/common/components/molecules/ActionsMenu';
import { useUser } from '@/common/contexts/UserContext';

/* ── styles ─────────────────────────────────────────── */

const badge = (approved) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '500',
  background: approved ? '#dcfce7' : '#fee2e2',
  color: approved ? '#166534' : '#991b1b',
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

function getActions(u, currentUser, { onSetApproved, onSetAdmin, onApproveAsAdmin }) {
  const isSelf = u.firebaseUid === currentUser?.firebaseUid;
  const isApproved = Boolean(u.isApproved);
  const isAdmin = Boolean(u.isAdmin);

  if (!isApproved) {
    return [
      { label: 'Approve as User', onClick: () => onSetApproved(u.firebaseUid, true) },
      { label: 'Approve as Admin', onClick: () => onApproveAsAdmin(u.firebaseUid) },
    ];
  }

  return [
    {
      label: 'Revoke Access',
      onClick: () => onSetApproved(u.firebaseUid, false),
      danger: true,
      disabled: isSelf,
    },
    isAdmin
      ? {
          label: 'Downgrade to User',
          onClick: () => onSetAdmin(u.firebaseUid, false),
          danger: true,
          disabled: isSelf,
        }
      : { label: 'Make Admin', onClick: () => onSetAdmin(u.firebaseUid, true) },
  ];
}

export default function UsersTable({ users, loading, onSetApproved, onSetAdmin, onApproveAsAdmin }) {
  const { user: currentUser } = useUser();

  const getDisplayName = (u) => {
    if (u.firstname && u.lastname) return `${u.firstname} ${u.lastname}`;
    return u.username || u.email;
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
                <span style={badge(u.isApproved)}>
                  {u.isApproved ? 'Approved' : 'Pending'}
                </span>
              </td>
              <td style={tdStyle}>
                {u.isAdmin ? <span style={adminBadge}>Admin</span> : '—'}
              </td>
              <td style={tdStyle}>
                <ActionsMenu
                  actions={getActions(u, currentUser, {
                    onSetApproved,
                    onSetAdmin,
                    onApproveAsAdmin,
                  })}
                />
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
  onSetApproved: PropTypes.func.isRequired,
  onSetAdmin: PropTypes.func.isRequired,
  onApproveAsAdmin: PropTypes.func.isRequired,
};
