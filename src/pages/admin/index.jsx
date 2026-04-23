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
  divider: {
    borderTop: '1px solid #f0f0ee',
    margin: '28px 0',
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

  const pending = users.filter((u) => !u.isApproved);
  const active = users.filter((u) => u.isApproved);

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div>
          <div style={styles.title}>User Management</div>
          <div style={styles.subtitle}>Manage user access and permissions.</div>
        </div>
      </div>

      <Card style={{ padding: '24px' }}>
        {error ? (
          <div style={styles.errorMsg}>{error}</div>
        ) : (
          <>
            <SectionTitle>Pending Approval</SectionTitle>
            <UsersTable
              users={pending}
              loading={loading}
              onSetApproved={setApproved}
              onSetAdmin={setAdmin}
              onApproveAsAdmin={approveAsAdmin}
            />

            <div style={styles.divider} />

            <SectionTitle>Active Users</SectionTitle>
            <UsersTable
              users={active}
              loading={loading}
              onSetApproved={setApproved}
              onSetAdmin={setAdmin}
              onApproveAsAdmin={approveAsAdmin}
            />
          </>
        )}
      </Card>
    </main>
  );
}
