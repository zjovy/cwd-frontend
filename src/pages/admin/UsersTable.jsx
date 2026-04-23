import { useState } from 'react';

import { useUser } from '@/common/contexts/UserContext';
import PropTypes from 'prop-types';

/* ── styles ─────────────────────────────────────────── */

const tableStyle = { width: '100%', borderCollapse: 'collapse' };

const thStyle = {
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '600',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  paddingBottom: '12px',
  borderBottom: '1px solid #f0f0ee',
};

const tdStyle = {
  padding: '14px 0',
  fontSize: '14px',
  color: '#374151',
  borderBottom: '1px solid #f9f9f8',
};

const emptyMsg = {
  padding: '40px 0',
  textAlign: 'center',
  fontSize: '14px',
  color: '#6b7280',
};

const actionsBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '18px',
  letterSpacing: '2px',
  padding: '0 4px',
  lineHeight: 1,
  position: 'relative',
};

const menuStyle = {
  position: 'absolute',
  right: 0,
  top: '100%',
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,.1)',
  zIndex: 10,
  minWidth: '150px',
  overflow: 'hidden',
};

const menuItem = {
  display: 'block',
  width: '100%',
  padding: '8px 14px',
  fontSize: '13px',
  color: '#374151',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
};

const menuItemDanger = { ...menuItem, color: '#dc2626' };

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

/* ── ActionsMenu ─────────────────────────────────────── */

function ActionsMenu({ user, onSetApproved, onSetAdmin, onApproveAsAdmin, isSelf }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const isApproved = Boolean(user.isApproved);
  const isAdmin = Boolean(user.isAdmin);

  return (
    <span style={{ position: 'relative' }}>
      <button style={actionsBtnStyle} onClick={() => setOpen((v) => !v)}>
        ···
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 9 }} onClick={close} />
          <div style={menuStyle}>
            {!isApproved ? (
              <>
                <button
                  style={menuItem}
                  onClick={() => { close(); onSetApproved(user.firebaseUid, true); }}
                >
                  Approve as User
                </button>
                <button
                  style={menuItem}
                  onClick={() => { close(); onApproveAsAdmin(user.firebaseUid); }}
                >
                  Approve as Admin
                </button>
              </>
            ) : (
              <>
                <button
                  style={isSelf ? { ...menuItemDanger, opacity: 0.4, cursor: 'not-allowed' } : menuItemDanger}
                  disabled={isSelf}
                  onClick={() => { close(); onSetApproved(user.firebaseUid, false); }}
                >
                  Revoke Access
                </button>
                {isAdmin && (
                  <button
                    style={isSelf ? { ...menuItemDanger, opacity: 0.4, cursor: 'not-allowed' } : menuItemDanger}
                    disabled={isSelf}
                    onClick={() => { close(); onSetAdmin(user.firebaseUid, false); }}
                  >
                    Downgrade to User
                  </button>
                )}
                {!isAdmin && (
                  <button
                    style={menuItem}
                    onClick={() => { close(); onSetAdmin(user.firebaseUid, true); }}
                  >
                    Make Admin
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </span>
  );
}

ActionsMenu.propTypes = {
  user: PropTypes.object.isRequired,
  onSetApproved: PropTypes.func.isRequired,
  onSetAdmin: PropTypes.func.isRequired,
  onApproveAsAdmin: PropTypes.func.isRequired,
  isSelf: PropTypes.bool.isRequired,
};

/* ── UsersTable ──────────────────────────────────────── */

const COLUMNS = ['Name', 'Email', 'Access', 'Admin', 'Actions'];

export default function UsersTable({ users, onSetApproved, onSetAdmin, onApproveAsAdmin }) {
  const { user: currentUser } = useUser();

  const getDisplayName = (u) => {
    if (u.firstname && u.lastname) return `${u.firstname} ${u.lastname}`;
    return u.username || u.email;
  };

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
            <td colSpan={COLUMNS.length} style={emptyMsg}>
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
                  user={u}
                  onSetApproved={onSetApproved}
                  onSetAdmin={onSetAdmin}
                  onApproveAsAdmin={onApproveAsAdmin}
                  isSelf={u.firebaseUid === currentUser?.firebaseUid}
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
  onSetApproved: PropTypes.func.isRequired,
  onSetAdmin: PropTypes.func.isRequired,
  onApproveAsAdmin: PropTypes.func.isRequired,
};
