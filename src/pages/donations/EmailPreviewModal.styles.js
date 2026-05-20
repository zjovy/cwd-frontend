export const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
};

export const modal = {
  background: '#fff',
  borderRadius: '12px',
  padding: '28px 32px',
  width: '100%',
  maxWidth: '540px',
  boxShadow: '0 8px 30px rgba(0,0,0,.15)',
  maxHeight: '90vh',
  overflowY: 'auto',
};

export const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
};

export const titleStyle = {
  fontSize: '16px',
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

export const readonlyInput = {
  fontSize: '14px',
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  background: '#f9fafb',
  color: '#374151',
  boxSizing: 'border-box',
  width: '100%',
};

export const textareaStyle = {
  fontSize: '13px',
  fontFamily: 'inherit',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  resize: 'vertical',
  minHeight: '200px',
  lineHeight: '1.6',
};

export const footerRow = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '20px',
};

const btnBase = {
  padding: '8px 18px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  border: 'none',
};

export const cancelBtn = {
  ...btnBase,
  background: '#f3f4f6',
  color: '#374151',
};

export const sendBtn = {
  ...btnBase,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: '#2563eb',
  color: '#fff',
};
