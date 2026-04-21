import { useEffect, useState } from 'react';

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
  maxWidth: '460px',
  boxShadow: '0 8px 30px rgba(0,0,0,.12)',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1a1a1a',
  marginBottom: '20px',
};

const fieldGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '14px',
};

const labelStyle = {
  fontSize: '13px',
  fontWeight: '500',
  color: '#374151',
};

const inputStyle = {
  fontSize: '14px',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const row = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '10px',
  marginTop: '22px',
};

const btnBase = {
  padding: '8px 18px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
  border: 'none',
};

const cancelBtn = { ...btnBase, background: '#f3f4f6', color: '#374151' };
const submitBtn = { ...btnBase, background: '#2563eb', color: '#fff' };

const errorStyle = {
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '10px',
};

function toFormValues(donor) {
  return {
    name: donor?.name ?? '',
    email: donor?.email ?? '',
    phone: donor?.phone ?? '',
    address: donor?.address ?? '',
  };
}

export default function DonorEditModal({ open, onClose, onSubmit, donor }) {
  const [form, setForm] = useState(toFormValues(donor));
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(toFormValues(donor));
    setError(null);
  }, [donor, open]);

  if (!open) return null;

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit({
        ...form,
        total_donations: donor?.total_donations ?? 0,
        donation_count: donor?.donation_count ?? 0,
        most_recent: donor?.most_recent?.slice(0, 10) ?? null,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <form
        style={modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div style={titleStyle}>Edit Contact Information</div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={fieldGroup}>
          <label style={labelStyle}>Name</label>
          <input
            style={inputStyle}
            value={form.name}
            onChange={set('name')}
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type='email'
            value={form.email}
            onChange={set('email')}
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Phone</label>
          <input
            style={inputStyle}
            type='tel'
            value={form.phone}
            onChange={set('phone')}
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Address</label>
          <input
            style={inputStyle}
            value={form.address}
            onChange={set('address')}
          />
        </div>

        <div style={row}>
          <button type='button' style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type='submit' style={submitBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}

DonorEditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  donor: PropTypes.object,
};
