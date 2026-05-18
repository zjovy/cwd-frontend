import { Send } from 'lucide-react';
import PropTypes from 'prop-types';

import {
  errorStyle,
  infoValue,
  labelStyle,
  sectionBox,
  sectionTitle,
  sendBtn,
  statusBadgeStyle,
  successStyle,
} from './DonationViewModal.styles';

const receiptHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
  marginBottom: '14px',
};

const receiptBody = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
};

const recipientBlock = {
  minWidth: '220px',
  flex: 1,
};

const statusMessageStyle = (isError) => ({
  ...(isError ? errorStyle : successStyle),
  display: 'block',
  marginTop: '10px',
});

export default function DonationReceiptSection({
  email,
  emailMsg,
  isError,
  onSendEmail,
  status,
}) {
  return (
    <div style={sectionBox}>
      <div style={receiptHeader}>
        <div style={{ ...sectionTitle, marginBottom: 0 }}>Receipt</div>
        <span style={statusBadgeStyle(status)}>{status}</span>
      </div>

      <div style={receiptBody}>
        <div style={recipientBlock}>
          <div style={labelStyle}>Recipient</div>
          <div style={infoValue}>{email || '-'}</div>
        </div>
        <button type='button' style={sendBtn} onClick={onSendEmail}>
          <Send size={13} /> Preview & Send Receipt
        </button>
      </div>

      {emailMsg && <span style={statusMessageStyle(isError)}>{emailMsg}</span>}
    </div>
  );
}

DonationReceiptSection.propTypes = {
  email: PropTypes.string.isRequired,
  emailMsg: PropTypes.string,
  isError: PropTypes.bool,
  onSendEmail: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

DonationReceiptSection.defaultProps = {
  emailMsg: null,
  isError: false,
};
