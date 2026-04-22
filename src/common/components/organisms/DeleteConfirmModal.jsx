import { useState } from 'react';

import PropTypes from 'prop-types';

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modal = {
  background: '#fff',
  borderRadius: '12px',
  padding: '28px 32px',
  width: '100%',
  maxWidth: '400px',
  boxShadow: '0 8px 30px rgba(0,0,0,.12)',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '8px',
};

const messageStyle = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '22px',
  lineHeight: '1.5',
};

const row = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
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

const deleteBtn = {
  ...btnBase,
  background: '#dc2626',
  color: '#fff',
};

const errorStyle = {
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '10px',
};

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  donorName,
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={titleStyle}>Delete Donation</div>
        <div style={messageStyle}>
          Are you sure you want to delete the donation from{' '}
          <strong>{donorName}</strong>? This action cannot be undone.
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={row}>
          <button style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={deleteBtn} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  donorName: PropTypes.string,
};
