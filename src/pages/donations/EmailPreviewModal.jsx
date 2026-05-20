import { useRef } from 'react';

import { Send } from 'lucide-react';
import PropTypes from 'prop-types';

import {
  cancelBtn,
  closeBtn,
  fieldGroup,
  footerRow,
  headerRow,
  labelStyle,
  modal,
  overlay,
  readonlyInput,
  sendBtn,
  textareaStyle,
  titleStyle,
} from './EmailPreviewModal.styles';

export default function EmailPreviewModal({
  open,
  to,
  subject,
  body,
  sending,
  onClose,
  onConfirm,
}) {
  const bodyRef = useRef(body);

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(bodyRef.current);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div
        aria-modal='true'
        role='dialog'
        style={modal}
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
            ref={(node) => {
              if (node) bodyRef.current = node.value;
            }}
            style={textareaStyle}
            defaultValue={body}
            onChange={(e) => {
              bodyRef.current = e.target.value;
            }}
          />
        </div>

        <div style={footerRow}>
          <button type='button' style={cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            type='button'
            style={sendBtn}
            onClick={handleConfirm}
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
  to: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  sending: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

EmailPreviewModal.defaultProps = {
  sending: false,
};
