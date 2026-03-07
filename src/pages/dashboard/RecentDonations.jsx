import Badge from '@/common/components/atoms/Badge';
import Card from '@/common/components/atoms/Card';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import { donations } from '@/utils/donationsData';

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

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

const actionsBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '18px',
  letterSpacing: '2px',
  padding: '0 4px',
  lineHeight: 1,
};

const HEADERS = ['Name', 'Amount', 'Date', 'Receipt Status', 'Actions'];

export default function RecentDonations() {
  return (
    <Card style={{ marginTop: '20px', padding: '24px' }}>
      <SectionTitle>Recent Donations</SectionTitle>
      <table style={tableStyle}>
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th key={h} style={thStyle}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {donations.map((d, i) => (
            <tr key={i}>
              <td style={{ ...tdStyle, fontWeight: '500', color: '#1a1a1a' }}>
                {d.name}
              </td>
              <td style={tdStyle}>{d.amount}</td>
              <td style={tdStyle}>{d.date}</td>
              <td style={tdStyle}>
                <Badge status={d.status} />
              </td>
              <td style={tdStyle}>
                <button style={actionsBtnStyle}>···</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
