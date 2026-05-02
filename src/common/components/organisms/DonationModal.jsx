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

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
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

const cancelBtn = {
  ...btnBase,
  background: '#f3f4f6',
  color: '#374151',
};

const submitBtn = {
  ...btnBase,
  background: '#2563eb',
  color: '#fff',
};

const errorStyle = {
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '10px',
};

const EMPTY = {
  donor_name: '',
  donor_email: '',
  amount: '',
  donation_date: '',
  receipt_status: 'pending',
};

function toFormValues(donation) {
  if (!donation) return { ...EMPTY };
  return {
    donor_name: donation.donor_name ?? '',
    donor_email: donation.donor_email ?? '',
    amount: donation.amount ?? '',
    donation_date: donation.donation_date?.slice(0, 10) ?? '',
    receipt_status: donation.receipt_status ?? 'pending',
  };
}

export default function DonationModal({ open, onClose, onSubmit, donation }) {
  const isEdit = Boolean(donation);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(toFormValues(donation));
    setError(null);
  }, [donation, open]);

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
        amount: parseFloat(form.amount),
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
        <div style={titleStyle}>
          {isEdit ? 'Edit Donation' : 'New Donation'}
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <div style={fieldGroup}>
          <label style={labelStyle}>Donor Name</label>
          <input
            style={inputStyle}
            value={form.donor_name}
            onChange={set('donor_name')}
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Donor Email</label>
          <input
            style={inputStyle}
            type='email'
            value={form.donor_email}
            onChange={set('donor_email')}
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Amount ($)</label>
          <input
            style={inputStyle}
            type='number'
            step='0.01'
            min='0'
            value={form.amount}
            onChange={set('amount')}
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Donation Date</label>
          <input
            style={inputStyle}
            type='date'
            value={form.donation_date}
            onChange={set('donation_date')}
            required
          />
        </div>

        <div style={fieldGroup}>
          <label style={labelStyle}>Receipt Status</label>
          <select
            style={selectStyle}
            value={form.receipt_status}
            onChange={set('receipt_status')}
          >
            <option value='pending'>Pending</option>
            <option value='sent'>Sent</option>
          </select>
        </div>

        <div style={row}>
          <button type='button' style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type='submit' style={submitBtn} disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
}

DonationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  donation: PropTypes.object,
};
