import PropTypes from 'prop-types';

import {
  infoGrid,
  infoRow,
  infoValue,
  labelStyle,
  sectionBox,
  sectionTitle,
} from './DonationViewModal.styles';

function InfoItem({ label, value }) {
  return (
    <div style={infoRow}>
      <div style={labelStyle}>{label}</div>
      <div style={infoValue}>{value || '-'}</div>
    </div>
  );
}

export default function DonationDonorInfoSection({ form }) {
  return (
    <div style={sectionBox}>
      <div style={sectionTitle}>Donor Information</div>
      <div style={infoGrid}>
        <InfoItem
          label='Name'
          value={`${form.first_name} ${form.last_name}`.trim()}
        />
        <InfoItem label='Email' value={form.email} />
        <InfoItem label='Phone' value={form.phone} />
        <InfoItem label='Address' value={form.address} />
      </div>
    </div>
  );
}

InfoItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

InfoItem.defaultProps = {
  value: '',
};

DonationDonorInfoSection.propTypes = {
  form: PropTypes.shape({
    address: PropTypes.string,
    email: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    phone: PropTypes.string,
  }).isRequired,
};
