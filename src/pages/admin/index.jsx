import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import useUsers from '@/hooks/useUsers';

import UsersTable from './UsersTable';

/* ── styles ─────────────────────────────────────────── */

const styles = {
  main: {
    flex: 1,
    padding: '36px 40px',
    overflowY: 'auto',
    minHeight: '100vh',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  countPill: {
    padding: '3px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '500',
    background: '#f3f4f6',
    color: '#6b7280',
  },
  errorMsg: {
    padding: '40px 0',
    textAlign: 'center',
    fontSize: '14px',
    color: '#dc2626',
  },
};

/* ── AdminPage ───────────────────────────────────────── */

export default function AdminPage() {
  const { users, loading, error, setApproved, setAdmin, approveAsAdmin } = useUsers();

  const requesting = users.filter((u) => !u.isApproved);
  const activeUsers = users.filter((u) => u.isApproved && !u.isAdmin);
  const admins = users.filter((u) => u.isApproved && u.isAdmin);

  if (error) {
    return (
      <main style={styles.main}>
        <div style={styles.topRow}>
          <div>
            <div style={styles.title}>User Management</div>
            <div style={styles.subtitle}>Manage user access and permissions.</div>
          </div>
        </div>
        <div style={styles.errorMsg}>{error}</div>
      </main>
    );
  }

  const tableProps = { onSetApproved: setApproved, onSetAdmin: setAdmin, onApproveAsAdmin: approveAsAdmin };

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>User Management</div>
          <div style={styles.subtitle}>Manage user access and permissions.</div>
        </div>
      </div>

      <Card style={{ padding: '24px' }}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ marginBottom: 0 }}>Requesting Access</SectionTitle>
          <span style={styles.countPill}>{requesting.length}</span>
        </div>
        <UsersTable users={requesting} loading={loading} {...tableProps} />
      </Card>

      <Card style={{ padding: '24px', marginTop: '16px' }}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ marginBottom: 0 }}>Users</SectionTitle>
          <span style={styles.countPill}>{activeUsers.length}</span>
        </div>
        <UsersTable users={activeUsers} loading={loading} {...tableProps} />
      </Card>

      <Card style={{ padding: '24px', marginTop: '16px' }}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ marginBottom: 0 }}>Admins</SectionTitle>
          <span style={styles.countPill}>{admins.length}</span>
        </div>
        <UsersTable users={admins} loading={loading} {...tableProps} />
      </Card>
    </main>
  );
}
