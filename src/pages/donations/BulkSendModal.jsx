import { useState } from 'react';

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

const recipientListStyle = {
  fontSize: '13px',
  padding: '8px 12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  background: '#f9fafb',
  color: '#374151',
  maxHeight: '140px',
  overflowY: 'auto',
};

const summaryStyle = {
  fontSize: '13px',
  color: '#374151',
  lineHeight: 1.5,
};

const resultStyle = (isError) => ({
  marginTop: '12px',
  padding: '10px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  background: isError ? '#fef2f2' : '#f0fdf4',
  color: isError ? '#b91c1c' : '#15803d',
  border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
});

const failedListStyle = {
  marginTop: '8px',
  paddingLeft: '18px',
  maxHeight: '120px',
  overflowY: 'auto',
  fontSize: '12px',
  lineHeight: 1.5,
};

export default function BulkSendModal({
  open,
  recipients,
  allUnsent,
  subject,
  defaultBody,
  sending,
  result,
  onClose,
  onConfirm,
}) {
  const [body, setBody] = useState(defaultBody);

  if (!open) return null;

  const handleConfirm = () => {
    const edited = body && body !== defaultBody ? body : null;
    onConfirm(edited);
  };

  const headerLabel = allUnsent
    ? 'Send to all unsent (matching filters)'
    : `Send to ${recipients.length} selected donor${recipients.length === 1 ? '' : 's'}`;

  return (
    <div style={overlay} onClick={onClose}>
      <div
        aria-modal='true'
        role='dialog'
        style={modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={headerRow}>
          <div style={titleStyle}>Send Receipts</div>
          <button type='button' style={closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>Recipients</div>
          {allUnsent ? (
            <div style={summaryStyle}>
              Every donation matching your current filters whose receipt has not
              been sent will receive an email.
            </div>
          ) : (
            <div style={recipientListStyle}>
              {recipients.map((r) => (
                <div key={r.id}>
                  {r.donorFullName} &lt;{r.donorEmail || 'no email'}&gt;
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>Subject</div>
          <div style={readonlyInput}>{subject}</div>
        </div>

        <div style={fieldGroup}>
          <label htmlFor='bulk-send-message' style={labelStyle}>
            Message (each donor gets a personalized version unless you edit
            this)
          </label>
          <textarea
            id='bulk-send-message'
            style={textareaStyle}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {result && (
          <div style={resultStyle(result.failed.length > 0)}>
            Sent {result.sent.length} of {result.total}.
            {result.failed.length > 0 && (
              <>
                {' '}
                {result.failed.length} failed:
                <ul style={failedListStyle}>
                  {result.failed.map((f, i) => (
                    <li key={`${f.id}-${i}`}>
                      {f.name || `id ${f.id}`}
                      {f.email ? ` <${f.email}>` : ''} — {f.error}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        <div style={footerRow}>
          <button type='button' style={cancelBtn} onClick={onClose}>
            {result ? 'Close' : 'Cancel'}
          </button>
          {!result && (
            <button
              type='button'
              style={sendBtn}
              onClick={handleConfirm}
              disabled={sending}
            >
              <Send size={13} /> {sending ? 'Sending...' : headerLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

BulkSendModal.propTypes = {
  open: PropTypes.bool.isRequired,
  recipients: PropTypes.array,
  allUnsent: PropTypes.bool,
  subject: PropTypes.string.isRequired,
  defaultBody: PropTypes.string.isRequired,
  sending: PropTypes.bool,
  result: PropTypes.shape({
    sent: PropTypes.array.isRequired,
    failed: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

BulkSendModal.defaultProps = {
  recipients: [],
  allUnsent: false,
  sending: false,
  result: null,
};
