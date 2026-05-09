import PropTypes from 'prop-types';

import {
  fieldGroup,
  inputStyle,
  labelStyle,
  sectionBox,
  sectionTitle,
} from './DonationViewModal.styles';

export default function DonationPaymentSection({ form, onChange }) {
  return (
    <div style={sectionBox}>
      <div style={sectionTitle}>Payment Details</div>

      <div style={fieldGroup}>
        <label htmlFor='donation-amount' style={labelStyle}>
          Amount ($)
        </label>
        <input
          id='donation-amount'
          style={inputStyle}
          type='number'
          step='0.01'
          min='0'
          value={form.amount}
          onChange={onChange('amount')}
          required
        />
      </div>

      <div style={fieldGroup}>
        <label htmlFor='donation-date' style={labelStyle}>
          Date
        </label>
        <input
          id='donation-date'
          style={inputStyle}
          type='date'
          value={form.donation_date}
          onChange={onChange('donation_date')}
          required
        />
      </div>
    </div>
  );
}

DonationPaymentSection.propTypes = {
  form: PropTypes.shape({
    amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    donation_date: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};
