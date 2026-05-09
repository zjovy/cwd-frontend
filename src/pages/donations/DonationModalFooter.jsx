import PropTypes from 'prop-types';

import { cancelBtn, footerRow, saveBtn } from './DonationViewModal.styles';

export default function DonationModalFooter({ onClose, saving }) {
  return (
    <div style={footerRow}>
      <button type='button' style={cancelBtn} onClick={onClose}>
        Cancel
      </button>
      <button type='submit' style={saveBtn} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

DonationModalFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  saving: PropTypes.bool.isRequired,
};
