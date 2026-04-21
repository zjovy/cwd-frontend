import Card from '@/common/components/atoms/Card';
import Button from '@/common/components/atoms/CommonButton';
import SectionTitle from '@/common/components/atoms/SectionTitle';
import { Mail, MapPin, Phone, SquarePen } from 'lucide-react';
import PropTypes from 'prop-types';

const styles = {
  card: { padding: '24px', marginBottom: '20px' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px 32px',
  },
  field: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  icon: { color: '#9ca3af', marginTop: '2px', flexShrink: 0 },
  fieldBody: { display: 'flex', flexDirection: 'column', gap: '2px' },
  label: { fontSize: '13px', color: '#6b7280' },
  value: {
    fontSize: '14px',
    color: '#1a1a1a',
    fontWeight: '500',
    whiteSpace: 'pre-line',
    wordBreak: 'break-word',
  },
};

function Field({ icon, label, children }) {
  return (
    <div style={styles.field}>
      <span style={styles.icon}>{icon}</span>
      <div style={styles.fieldBody}>
        <span style={styles.label}>{label}</span>
        <span style={styles.value}>{children || '—'}</span>
      </div>
    </div>
  );
}

Field.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default function ContactInfoCard({ email, phone, address, onEdit }) {
  return (
    <Card style={styles.card}>
      <div style={styles.header}>
        <SectionTitle>Contact Information</SectionTitle>
        <Button variant='outline' onClick={onEdit}>
          <SquarePen size={14} strokeWidth={2} />
          Edit
        </Button>
      </div>
      <div style={styles.grid}>
        <Field icon={<Mail size={18} strokeWidth={1.8} />} label='Email'>
          {email}
        </Field>
        <Field icon={<MapPin size={18} strokeWidth={1.8} />} label='Address'>
          {address}
        </Field>
        <Field icon={<Phone size={18} strokeWidth={1.8} />} label='Phone'>
          {phone}
        </Field>
      </div>
    </Card>
  );
}

ContactInfoCard.propTypes = {
  email: PropTypes.string,
  phone: PropTypes.string,
  address: PropTypes.string,
  onEdit: PropTypes.func,
};

ContactInfoCard.defaultProps = {
  onEdit: undefined,
};
