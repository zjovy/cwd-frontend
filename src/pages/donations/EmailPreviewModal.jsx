import { useEffect, useState } from 'react';

import { Send } from 'lucide-react';
import PropTypes from 'prop-types';

import {
  cancelBtn,
  closeBtn,
  fieldGroup,
  footerRow,
  headerRow,
  labelStyle,
  modalWide,
  overlay,
  readonlyInput,
  sendBtn,
  textareaStyle,
  titleStyle,
} from './EmailPreviewModal.styles';
import ReceiptPdfPreview from './ReceiptPdfPreview';

export default function EmailPreviewModal({
  open,
  donationId,
  to,
  subject,
  body,
  sending,
  onClose,
  onConfirm,
}) {
  const [message, setMessage] = useState(body);

  useEffect(() => {
    if (open) setMessage(body);
  }, [open, body]);

  if (!open) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div
        aria-modal='true'
        role='dialog'
        style={modalWide}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerRow}>
          <div style={titleStyle}>Preview Email</div>
          <button type='button' style={closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>To</div>
          <div style={readonlyInput}>{to}</div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>Subject</div>
          <div style={readonlyInput}>{subject}</div>
        </div>

        <div style={fieldGroup}>
          <label htmlFor='receipt-preview-message' style={labelStyle}>
            Message
          </label>
          <textarea
            id='receipt-preview-message'
            style={textareaStyle}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>Receipt PDF</div>
          <ReceiptPdfPreview donationId={donationId} body={message} />
        </div>

        <div style={footerRow}>
          <button type='button' style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type='button'
            style={sendBtn}
            onClick={() => onConfirm(message)}
            disabled={sending}
          >
            <Send size={13} /> {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </div>
    </div>
  );
}

EmailPreviewModal.propTypes = {
  open: PropTypes.bool.isRequired,
  donationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  to: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  sending: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

EmailPreviewModal.defaultProps = {
  donationId: null,
  sending: false,
};
