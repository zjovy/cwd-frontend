import { useEffect, useState } from 'react';

import { useUser } from '@/common/contexts/UserContext';
import DonationDeleteSection from '@/pages/donations/DonationDeleteSection';
import DonationDonorInfoSection from '@/pages/donations/DonationDonorInfoSection';
import DonationModalFooter from '@/pages/donations/DonationModalFooter';
import DonationPaymentSection from '@/pages/donations/DonationPaymentSection';
import DonationReceiptSection from '@/pages/donations/DonationReceiptSection';
import {
  closeBtn,
  errorStyle,
  headerRow,
  modal,
  overlay,
  titleStyle,
} from '@/pages/donations/DonationViewModal.styles';
import EmailPreviewModal from '@/pages/donations/EmailPreviewModal';
import {
  EMPTY_DONATION_VIEW_FORM,
  fromDonationRow,
} from '@/pages/donations/donationViewForm';
import donationService from '@/services/donationService';
import { RECEIPT_SUBJECT, buildReceiptMessage } from '@/utils/receiptTemplate';
import { X } from 'lucide-react';
import PropTypes from 'prop-types';
import { toast } from 'sonner';

export default function DonationViewModal({
  open,
  onClose,
  donation,
  onSave,
  onDelete,
  onReceiptSent,
}) {
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';

  const [form, setForm] = useState(EMPTY_DONATION_VIEW_FORM);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [emailMsg, setEmailMsg] = useState(null);
  const [isEmailError, setIsEmailError] = useState(false);
  const [emailPreview, setEmailPreview] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!open || !donation) return;
    setForm(fromDonationRow(donation));
    setError(null);
    setEmailMsg(null);
    setIsEmailError(false);
    setConfirmDelete(false);
    setDeleting(false);
    setSending(false);

    const controller = new AbortController();
    donationService
      .getById(donation.id, controller.signal)
      .then((detail) => {
        setForm((prev) => ({
          ...prev,
          address: detail.address ?? '',
          phone: detail.phone ?? '',
          description: detail.description ?? prev.description,
        }));
      })
      .catch((err) => {
        if (err.name !== 'AbortError')
          console.error('[DonationViewModal] detail fetch failed:', err);
      });
    return () => controller.abort();
  }, [open, donation?.id]);

  if (!open) return null;

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(donation.id, {
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
    setIsEmailError(false);
    setEmailPreview(true);
  };

  const handleConfirmSend = async (body) => {
    setSending(true);
    setEmailMsg(null);
    setIsEmailError(false);
    setError(null);
    try {
      await donationService.sendReceipt(donation.id, body);
      setForm((prev) => ({ ...prev, receipt_status: 'sent' }));
      await onReceiptSent?.();
      setEmailPreview(false);
      toast.success(`Receipt sent to ${form.email}`);
    } catch (err) {
      console.error('[DonationViewModal] send receipt failed:', err);
      setEmailPreview(false);
      toast.error(
        `Failed to send receipt to ${form.email || 'donor'}. Please try again.`
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <EmailPreviewModal
        open={emailPreview}
        to={form.email}
        subject={RECEIPT_SUBJECT}
        body={buildReceiptMessage(form)}
        sending={sending}
        onClose={() => setEmailPreview(false)}
        onConfirm={handleConfirmSend}
      />
      <div style={overlay} onClick={onClose}>
        <form
          aria-modal='true'
          role='dialog'
          style={modal}
          onSubmit={handleSave}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={headerRow}>
            <div style={titleStyle}>Donation Details</div>
            <button type='button' style={closeBtn} onClick={onClose}>
              <X size={16} />
            </button>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <DonationDonorInfoSection form={form} />
          <DonationPaymentSection form={form} onChange={set} />
          <DonationReceiptSection
            email={form.email}
            emailMsg={emailMsg}
            isError={isEmailError}
            onSendEmail={handleSendEmail}
            status={form.receipt_status}
          />
          <DonationModalFooter onClose={onClose} saving={saving} />
          {isAdmin && (
            <DonationDeleteSection
              confirmDelete={confirmDelete}
              deleting={deleting}
              onCancel={() => setConfirmDelete(false)}
              onConfirm={handleConfirmDelete}
              onRequest={() => setConfirmDelete(true)}
            />
          )}
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
  onReceiptSent: PropTypes.func,
};

DonationViewModal.defaultProps = {
  donation: null,
  onReceiptSent: null,
};
