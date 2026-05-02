import { useEffect, useState } from 'react';

import { Send } from 'lucide-react';
import { PropTypes } from 'prop-types';

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.55)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
};

const modal = {
  background: '#fff',
  borderRadius: '12px',
  padding: '28px 32px',
  width: '100%',
  maxWidth: '540px',
  boxShadow: '0 8px 30px rgba(0,0,0,.15)',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
};

const titleStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#1a1a1a',
};

const closeBtn = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#9ca3af',
  fontSize: '20px',
  lineHeight: 1,
  padding: '0 2px',
};

const fieldGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
};

const readonlyInput = {
  fontSize: '14px',
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  background: '#f9fafb',
  color: '#374151',
  boxSizing: 'border-box',
  width: '100%',
};

const textareaStyle = {
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

const footerRow = {
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

const cancelBtn = {
  ...btnBase,
  background: '#f3f4f6',
  color: '#374151',
};

const sendBtn = {
  ...btnBase,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: '#2563eb',
  color: '#fff',
};

export default function EmailPreviewModal({
  open,
  to,
  subject,
  body,
  onClose,
  onConfirm,
}) {
  const [editedBody, setEditedBody] = useState(body);

  useEffect(() => {
    if (open) setEditedBody(body);
  }, [open, body]);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(editedBody);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={headerRow}>
          <div style={titleStyle}>Preview Email</div>
          <button type='button' style={closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>To</label>
          <div style={readonlyInput}>{to}</div>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Subject</label>
          <div style={readonlyInput}>{subject}</div>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Message</label>
          <textarea
            style={textareaStyle}
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
          />
        </div>

        <div style={footerRow}>
          <button type='button' style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type='button' style={sendBtn} onClick={handleConfirm}>
            <Send size={13} /> Open in Mail
          </button>
        </div>
      </div>
    </div>
  );
}

EmailPreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  to: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
