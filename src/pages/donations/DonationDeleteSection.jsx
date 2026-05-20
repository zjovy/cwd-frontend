import PropTypes from 'prop-types';

import {
  cancelBtn,
  deleteBtn,
  deleteConfirmBtn,
} from './DonationViewModal.styles';

const sectionStyle = {
  borderTop: '1px solid #f0f0ee',
  marginTop: '18px',
  paddingTop: '14px',
};

const dangerRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  flexWrap: 'wrap',
};

const dangerCopy = {
  minWidth: '220px',
  flex: 1,
};

const dangerTitle = {
  color: '#991b1b',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '3px',
};

const dangerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: 1.4,
};

const actionRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexWrap: 'wrap',
};

export default function DonationDeleteSection({
  confirmDelete,
  deleting,
  onCancel,
  onConfirm,
  onRequest,
}) {
  return (
    <div style={sectionStyle}>
      {confirmDelete ? (
        <div style={dangerRow}>
          <div style={dangerCopy}>
            <div style={dangerTitle}>Delete donation?</div>
            <div style={dangerText}>This action cannot be undone.</div>
          </div>
          <div style={actionRow}>
            <button
              type='button'
              style={cancelBtn}
              onClick={onCancel}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              type='button'
              style={deleteConfirmBtn}
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      ) : (
        <div style={dangerRow}>
          <div style={dangerCopy}>
            <div style={dangerTitle}>Danger zone</div>
            <div style={dangerText}>Remove this donation record.</div>
          </div>
          <button type='button' style={deleteBtn} onClick={onRequest}>
            Delete Donation
          </button>
        </div>
      )}
    </div>
  );
}

DonationDeleteSection.propTypes = {
  confirmDelete: PropTypes.bool.isRequired,
  deleting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onRequest: PropTypes.func.isRequired,
};
