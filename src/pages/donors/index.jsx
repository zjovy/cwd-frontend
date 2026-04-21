import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@/common/components/atoms/Card';
import donorService from '@/services/donorService';
import { formatAmount, formatDate } from '@/utils/format';

const styles = {
  main: {
    flex: 1,
    padding: '36px 40px',
    overflowY: 'auto',
    minHeight: '100vh',
  },
  topRow: { marginBottom: '20px' },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '-0.03em',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  subtitle: { fontSize: '14px', color: '#6b7280' },
  card: { padding: '24px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0ee',
  },
  td: {
    padding: '14px 0',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f9f9f8',
  },
  row: { cursor: 'pointer' },
  nameCell: { fontWeight: '500', color: '#1a1a1a' },
  status: {
    padding: '40px 0',
    textAlign: 'center',
    fontSize: '14px',
    color: '#6b7280',
  },
};

const COLUMNS = [
  'Name',
  'Email',
  'Phone',
  'Total Donated',
  'Donations',
  'Last Donation',
];

export default function DonorsPage() {
  const navigate = useNavigate();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await donorService.getAll(undefined, controller.signal);
        const rows = Array.isArray(res) ? res : res.donors || [];
        setDonors(rows);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, []);

  return (
    <main style={styles.main}>
      <div style={styles.topRow}>
        <div style={styles.title}>Donors</div>
        <div style={styles.subtitle}>
          View and manage everyone who has contributed.
        </div>
      </div>

      <Card style={styles.card}>
        {loading ? (
          <div style={styles.status}>Loading donors…</div>
        ) : error ? (
          <div style={{ ...styles.status, color: '#dc2626' }}>
            Error: {error}
          </div>
        ) : donors.length === 0 ? (
          <div style={styles.status}>No donors yet.</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                {COLUMNS.map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donors.map((d) => (
                <tr
                  key={d.id}
                  style={styles.row}
                  onClick={() => navigate(`/donors/${d.id}`)}
                >
                  <td style={{ ...styles.td, ...styles.nameCell }}>{d.name}</td>
                  <td style={styles.td}>{d.email}</td>
                  <td style={styles.td}>{d.phone || '—'}</td>
                  <td style={styles.td}>{formatAmount(d.total_donations)}</td>
                  <td style={styles.td}>{d.donation_count ?? 0}</td>
                  <td style={styles.td}>
                    {d.most_recent ? formatDate(d.most_recent) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </main>
  );
}
