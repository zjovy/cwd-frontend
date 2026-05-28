import { useEffect, useRef, useState } from 'react';

import { Send } from 'lucide-react';
import PropTypes from 'prop-types';

import {
  editTextToTemplate,
  templateToEditText,
} from '@/utils/receiptTemplate';

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
  titleStyle,
} from './EmailPreviewModal.styles';
import ReceiptMessageEditor from './ReceiptMessageEditor';

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

const hintStyle = {
  fontSize: '12px',
  color: '#6b7280',
  lineHeight: 1.5,
  marginBottom: '6px',
};

const linkBtn = {
  background: 'none',
  border: 'none',
  padding: 0,
  marginTop: '8px',
  fontSize: '13px',
  fontWeight: 500,
  color: '#2563eb',
  cursor: 'pointer',
  textAlign: 'left',
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
  templateLoading,
  recipientsLoading,
  sending,
  result,
  onClose,
  onConfirm,
}) {
  const defaultEditBody = templateToEditText(defaultBody);
  const editBodyRef = useRef(defaultEditBody);
  const [editorKey, setEditorKey] = useState(0);

  if (!open) return null;

  useEffect(() => {
    editBodyRef.current = defaultEditBody;
    setEditorKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultBody]);

  const handleConfirm = () => {
    const technicalBody = editTextToTemplate(editBodyRef.current);
    const edited =
      technicalBody && technicalBody !== defaultBody ? technicalBody : null;
    onConfirm(edited);
  };

  const handleResetMessage = () => {
    setEditorKey((key) => key + 1);
  };

  const headerLabel = allUnsent
    ? 'Send to all unsent (matching filters)'
    : `Send to ${recipients.length} selected donor${recipients.length === 1 ? '' : 's'}`;

  const isBusy = sending || templateLoading || recipientsLoading;

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
          {allUnsent && (
            <div style={summaryStyle}>
              We’ll send to the <strong>20 most recent</strong> unsent donations
              matching your current filters.
            </div>
          )}
          {recipientsLoading ? (
            <div style={summaryStyle}>Loading recipients…</div>
          ) : (
            <div style={recipientListStyle}>
              {recipients.length === 0 ? (
                <div>No recipients found.</div>
              ) : (
                recipients.map((r) => (
                  <div key={r.id}>
                    {r.donorFullName} &lt;{r.donorEmail || 'no email'}&gt;
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>Subject</div>
          <div style={readonlyInput}>{subject}</div>
        </div>

        <div style={fieldGroup}>
          <div style={labelStyle}>Message</div>
          <p style={hintStyle}>
            Edit the message below. Colored labels are filled in for each donor
            — select a label and press Delete or Backspace to remove it.
          </p>
          <ReceiptMessageEditor
            key={editorKey}
            initialValue={defaultEditBody}
            onChange={(value) => {
              editBodyRef.current = value;
            }}
          />
          <button type='button' style={linkBtn} onClick={handleResetMessage}>
            Reset to default message
          </button>
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
              disabled={isBusy || recipients.length === 0}
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
  templateLoading: PropTypes.bool,
  recipientsLoading: PropTypes.bool,
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
  templateLoading: false,
  recipientsLoading: false,
  sending: false,
  result: null,
};
