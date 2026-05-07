import { useEffect, useState } from 'react';

import RequiredStar from '@/common/components/atoms/RequiredStar';
import { validateDonorFields } from '@/utils/validators';
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

const requiredNote = {
  fontSize: '12px',
  color: '#6b7280',
  marginTop: '6px',
};

function toFormValues(donor) {
  return {
    first_name: donor?.first_name ?? '',
    last_name: donor?.last_name ?? '',
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

  const handlePhoneChange = (e) =>
    setForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+() -]/g, '') }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateDonorFields(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ ...form });
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

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ ...fieldGroup, flex: 1 }}>
            <label style={labelStyle}>
              First Name
              <RequiredStar />
            </label>
            <input
              style={inputStyle}
              placeholder='Jane'
              value={form.first_name}
              onChange={set('first_name')}
              required
            />
          </div>
          <div style={{ ...fieldGroup, flex: 1 }}>
            <label style={labelStyle}>
              Last Name
              <RequiredStar />
            </label>
            <input
              style={inputStyle}
              placeholder='Doe'
              value={form.last_name}
              onChange={set('last_name')}
              required
            />
          </div>
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>
            Email
            <RequiredStar />
          </label>
          <input
            style={inputStyle}
            type='email'
            placeholder='jane.doe@example.com'
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
            placeholder='5555555555'
            value={form.phone}
            onChange={handlePhoneChange}
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Address</label>
          <input
            style={inputStyle}
            placeholder='123 Main St, City, ST 12345'
            value={form.address}
            onChange={set('address')}
          />
        </div>

        <div style={requiredNote}>
          <RequiredStar /> Required
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
