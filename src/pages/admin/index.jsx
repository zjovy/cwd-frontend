import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import TableScroll from '@/common/components/atoms/TableScroll';
import useUsers from '@/hooks/useUsers';
import { usePageStyles } from '@/common/styles/pageStyles';

import UsersTable from './UsersTable';

/* ── styles ─────────────────────────────────────────── */

const styles = {
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '8px',
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
  const pageStyles = usePageStyles();
  const { users, loading, error, actionError, setRole, refetch } = useUsers();

  const requesting = users.filter((u) => u.role === 'pending');
  const activeUsers = users.filter((u) => u.role === 'member');
  const admins = users.filter((u) => u.role === 'admin');

  const header = (
    <div style={pageStyles.topRow}>
      <div>
        <div style={pageStyles.title}>User Management</div>
        <div style={pageStyles.subtitle}>Manage user access and permissions.</div>
      </div>
    </div>
  );

  if (error) {
    return (
      <main style={pageStyles.main}>
        {header}
        <div style={styles.errorMsg}>
          {error}{' '}
          <button
            type='button'
            onClick={refetch}
            style={{
              marginLeft: '8px',
              cursor: 'pointer',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              color: '#dc2626',
              fontSize: '14px',
            }}
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  const tableProps = { onSetRole: setRole };

  return (
    <main style={pageStyles.main}>
      {header}
      {actionError && <div style={styles.errorMsg}>{actionError}</div>}

      <Card style={{ padding: pageStyles.cardPadding }}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ marginBottom: 0 }}>
            Requesting Access
          </SectionTitle>
          <span style={styles.countPill}>{requesting.length}</span>
        </div>
        <TableScroll>
          <UsersTable users={requesting} loading={loading} {...tableProps} />
        </TableScroll>
      </Card>

      <Card style={{ padding: pageStyles.cardPadding, marginTop: '16px' }}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ marginBottom: 0 }}>Users</SectionTitle>
          <span style={styles.countPill}>{activeUsers.length}</span>
        </div>
        <TableScroll>
          <UsersTable users={activeUsers} loading={loading} {...tableProps} />
        </TableScroll>
      </Card>

      <Card style={{ padding: pageStyles.cardPadding, marginTop: '16px' }}>
        <div style={styles.sectionHeader}>
          <SectionTitle style={{ marginBottom: 0 }}>Admins</SectionTitle>
          <span style={styles.countPill}>{admins.length}</span>
        </div>
        <TableScroll>
          <UsersTable users={admins} loading={loading} {...tableProps} />
        </TableScroll>
      </Card>
    </main>
  );
}
