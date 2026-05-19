export const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

export const modal = {
  background: '#fff',
  borderRadius: '12px',
  padding: '28px 32px',
  width: '100%',
  maxWidth: '560px',
  boxShadow: '0 8px 30px rgba(0,0,0,.12)',
  maxHeight: '90vh',
  overflowY: 'auto',
};

export const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
};

export const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1a1a1a',
};

export const closeBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '20px',
  lineHeight: 1,
  padding: '0 2px',
};

export const sectionTitle = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '12px',
  marginTop: '4px',
};

export const sectionBox = {
  background: '#f9f9f8',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '14px',
};

export const infoGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '14px 18px',
};

export const infoRow = {
  minWidth: 0,
};

export const infoValue = {
  color: '#1f2937',
  fontSize: '14px',
  lineHeight: 1.4,
  overflowWrap: 'anywhere',
};

export const fieldGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px',
};

export const labelStyle = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
};

export const inputStyle = {
  fontSize: '14px',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  background: '#fff',
};

export const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

export const footerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  flexWrap: 'wrap',
  marginTop: '22px',
  gap: '10px',
};

export const btnBase = {
  padding: '8px 18px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  border: 'none',
};

export const sendBtn = {
  ...btnBase,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: '#f0fdf4',
  color: '#16a34a',
  border: '1px solid #bbf7d0',
};

export const statusBadgeStyle = (status) => ({
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '600',
  padding: '4px 10px',
  textTransform: 'capitalize',
  ...(status === 'sent'
    ? { background: '#F0FDF4', color: '#15803D' }
    : { background: '#FFF4E5', color: '#B25000' }),
});

export const cancelBtn = {
  ...btnBase,
  background: '#f3f4f6',
  color: '#374151',
};

export const saveBtn = {
  ...btnBase,
  background: '#2563eb',
  color: '#fff',
};

export const deleteBtn = {
  ...btnBase,
  background: '#fef2f2',
  color: '#dc2626',
  border: '1px solid #fecaca',
};

export const deleteConfirmBtn = {
  ...btnBase,
  background: '#dc2626',
  color: '#fff',
};

export const errorStyle = {
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '8px',
};

export const successStyle = {
  color: '#16a34a',
  fontSize: '13px',
};
