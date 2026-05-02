/*
  DonationViewModal — view + edit a donation record.
  Pre-fills donation fields immediately from the passed `donation` prop.

  Props:
    open       – bool
    onClose    – () => void
    donation   – row object { id, donor_name, donor_email, amount, donation_date, receipt_status }
    onSave     – async (id, data) => void  (calls useDonations.updateDonation, handles refetch)
*/
import { useEffect, useState } from 'react';

import donationService from '@/services/donationService';
import { Send } from 'lucide-react';
import { PropTypes } from 'prop-types';

import EmailPreviewModal from './EmailPreviewModal';

/* ── styles ─────────────────────────────────────── */

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
  maxWidth: '520px',
  boxShadow: '0 8px 30px rgba(0,0,0,.12)',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const headerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
};

const titleStyle = {
  fontSize: '18px',
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

const sectionTitle = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#9ca3af',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '12px',
  marginTop: '4px',
};

const sectionBox = {
  background: '#f9f9f8',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '14px',
};

const fieldGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px',
};

const fieldGroupLast = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const labelStyle = {
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
};

const inputStyle = {
  fontSize: '14px',
  padding: '8px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  background: '#fff',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const footerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '22px',
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

const sendBtn = {
  ...btnBase,
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: '#f0fdf4',
  color: '#16a34a',
  border: '1px solid #bbf7d0',
};

const cancelBtn = {
  ...btnBase,
  background: '#f3f4f6',
  color: '#374151',
};

const saveBtn = {
  ...btnBase,
  background: '#2563eb',
  color: '#fff',
};

const deleteBtn = {
  ...btnBase,
  background: '#fef2f2',
  color: '#dc2626',
  border: '1px solid #fecaca',
};

const deleteConfirmBtn = {
  ...btnBase,
  background: '#dc2626',
  color: '#fff',
};

const errorStyle = {
  color: '#dc2626',
  fontSize: '13px',
  marginBottom: '8px',
};

const successStyle = {
  color: '#16a34a',
  fontSize: '13px',
};

/* ── helpers ────────────────────────────────────── */

const EMPTY = {
  donor_name: '',
  donor_email: '',
  amount: '',
  donation_date: '',
  receipt_status: 'pending',
  phone: '',
  address: '',
};

function fromDonationRow(d) {
  if (!d) return { ...EMPTY };
  return {
    donor_name: d.donor_name ?? '',
    donor_email: d.donor_email ?? '',
    amount: d.amount ?? '',
    donation_date: d.donation_date?.slice(0, 10) ?? '',
    receipt_status: d.receipt_status ?? 'pending',
    phone: '',
    address: '',
  };
}

/* ── component ──────────────────────────────────── */

export default function DonationViewModal({
  open,
  onClose,
  donation,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [emailMsg, setEmailMsg] = useState(null);
  const [emailPreview, setEmailPreview] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open || !donation) return;
    setForm(fromDonationRow(donation));
    setError(null);
    setEmailMsg(null);
    setConfirmDelete(false);
    setDeleting(false);

    donationService
      .getById(donation.id)
      .then((detail) => {
        setForm((prev) => ({
          ...prev,
          phone: detail.phone ?? '',
          address: detail.address ?? '',
        }));
      })
      .catch((err) => console.error('[DonationViewModal] detail fetch failed:', err));
  }, [open, donation?.id]);

  if (!open) return null;

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(donation.id, {
        donor_name: form.donor_name,
        donor_email: form.donor_email,
        amount: parseFloat(form.amount),
        donation_date: form.donation_date,
        receipt_status: form.receipt_status,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  function buildEmailBody() {
    const amount = parseFloat(form.amount || 0).toLocaleString();
    return [
      `Dear ${form.donor_name},`,
      '',
      `The C&W Market Foundation has received your generous gift of $${amount} to support our annual efforts. Your contribution makes a meaningful difference in the work we do for our community.`,
      '',
      'Thank you for your generosity and continued support.',
      '',
      'Sincerely,',
      'The C&W Market Foundation',
    ].join('\n');
  }

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(donation.id);
    } catch (err) {
      setError(err.message);
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handleSendEmail = () => {
    setEmailMsg(null);
    setEmailPreview(true);
  };

  const handleConfirmSend = (body) => {
    const subject = 'Donation Receipt — C&W Market Foundation';
    const mailto = `mailto:${encodeURIComponent(form.donor_email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailto, '_blank');
    setEmailPreview(false);
    setEmailMsg(`Opened mail client for ${form.donor_email}`);
  };

  return (
    <>
      <EmailPreviewModal
        open={emailPreview}
        to={form.donor_email}
        subject='Donation Receipt — C&W Market Foundation'
        body={buildEmailBody()}
        onClose={() => setEmailPreview(false)}
        onConfirm={handleConfirmSend}
      />
      <div style={overlay} onClick={onClose}>
        <form
          style={modal}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSave}
        >
          <div style={headerRow}>
            <div style={titleStyle}>Donation Details</div>
            <button type='button' style={closeBtn} onClick={onClose}>
              ×
            </button>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <div style={sectionBox}>
            <div style={sectionTitle}>Donor Information</div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Name</label>
              <input
                style={inputStyle}
                value={form.donor_name}
                onChange={set('donor_name')}
                required
              />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Email</label>
              <input
                style={inputStyle}
                type='email'
                value={form.donor_email}
                onChange={set('donor_email')}
                required
              />
            </div>

            <div style={fieldGroup}>
              <label style={labelStyle}>Phone</label>
              <input
                style={{ ...inputStyle, background: '#f3f4f6', color: '#6b7280' }}
                value={form.phone}
                readOnly
                placeholder='—'
              />
            </div>

            <div style={fieldGroupLast}>
              <label style={labelStyle}>Address</label>
              <input
                style={{ ...inputStyle, background: '#f3f4f6', color: '#6b7280' }}
                value={form.address}
                readOnly
                placeholder='—'
              />
            </div>
          </div>

          <div style={sectionBox}>
            <div style={sectionTitle}>Payment Details</div>

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
              <label style={labelStyle}>Date</label>
              <input
                style={inputStyle}
                type='date'
                value={form.donation_date}
                onChange={set('donation_date')}
                required
              />
            </div>

            <div style={fieldGroupLast}>
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
          </div>

          <div style={footerRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button type='button' style={sendBtn} onClick={handleSendEmail}>
                <Send size={13} /> Send Email
              </button>
              {emailMsg && (
                <span
                  style={
                    emailMsg.startsWith('Failed') ? errorStyle : successStyle
                  }
                >
                  {emailMsg}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type='button' style={cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type='submit' style={saveBtn} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid #f0f0ee',
              marginTop: '18px',
              paddingTop: '16px',
            }}
          >
            {confirmDelete ? (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <span style={{ fontSize: '13px', color: '#374151' }}>
                  Delete this donation?
                </span>
                <button
                  type='button'
                  style={cancelBtn}
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  style={deleteConfirmBtn}
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting…' : 'Yes, Delete'}
                </button>
              </div>
            ) : (
              <button
                type='button'
                style={deleteBtn}
                onClick={() => setConfirmDelete(true)}
              >
                Delete Donation
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

DonationViewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  donation: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
