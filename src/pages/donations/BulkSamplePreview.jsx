import { useEffect, useState } from 'react';

import donationService from '@/services/donationService';
import { applyReceiptTemplate } from '@/utils/receiptTemplate';
import PropTypes from 'prop-types';

import {
  fieldGroup,
  labelStyle,
  readonlyInput,
} from './EmailPreviewModal.styles';
import ReceiptPdfPreview from './ReceiptPdfPreview';

const hintStyle = {
  fontSize: '12px',
  color: '#6b7280',
  lineHeight: 1.5,
  marginBottom: '6px',
};

const sampleBodyStyle = {
  ...readonlyInput,
  whiteSpace: 'pre-wrap',
  lineHeight: 1.6,
  minHeight: '120px',
  maxHeight: '200px',
  overflowY: 'auto',
};

function hasPreviewFields(recipient) {
  return (
    recipient != null && recipient.amount != null && recipient.amount !== ''
  );
}

export default function BulkSamplePreview({
  recipients,
  sampleId,
  onSampleIdChange,
  templateBody,
}) {
  const [sampleDonation, setSampleDonation] = useState(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [sampleError, setSampleError] = useState(null);

  useEffect(() => {
    if (!recipients.length) {
      if (sampleId != null) onSampleIdChange(null);
      return;
    }
    const stillValid = recipients.some((r) => r.id === sampleId);
    if (!stillValid) onSampleIdChange(recipients[0].id);
  }, [recipients, sampleId, onSampleIdChange]);

  useEffect(() => {
    if (sampleId == null) {
      setSampleDonation(null);
      setSampleError(null);
      setLoadingSample(false);
      return undefined;
    }

    const fromList = recipients.find((r) => r.id === sampleId);
    if (hasPreviewFields(fromList)) {
      setSampleDonation(fromList);
      setSampleError(null);
      setLoadingSample(false);
      return undefined;
    }

    const controller = new AbortController();
    setLoadingSample(true);
    setSampleError(null);

    donationService
      .getById(sampleId, controller.signal)
      .then((donation) => {
        setSampleDonation(donation);
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return;
        console.error('[BulkSamplePreview] load donation failed:', err);
        setSampleDonation(fromList || null);
        setSampleError(err.message || 'Failed to load sample donor details.');
      })
      .finally(() => setLoadingSample(false));

    return () => controller.abort();
  }, [sampleId, recipients]);

  if (!recipients.length) return null;

  const personalized =
    sampleDonation && templateBody
      ? applyReceiptTemplate(templateBody, sampleDonation)
      : '';

  return (
    <div style={fieldGroup}>
      <div style={labelStyle}>Sample preview</div>
      <p style={hintStyle}>
        Click a recipient above to preview their personalized email and PDF.
        Other recipients get the same template filled with their details.
      </p>

      {loadingSample && (
        <div style={{ ...readonlyInput, marginBottom: '8px' }}>
          Loading sample…
        </div>
      )}
      {sampleError && (
        <div
          style={{
            ...readonlyInput,
            marginBottom: '8px',
            color: '#b91c1c',
            background: '#fef2f2',
          }}
        >
          {sampleError}
        </div>
      )}

      <div style={{ ...labelStyle, marginBottom: '4px' }}>
        Sample message
        {sampleDonation?.donorFullName
          ? ` — ${sampleDonation.donorFullName}`
          : ''}
      </div>
      <div style={sampleBodyStyle}>
        {personalized || 'Select a recipient to preview the message.'}
      </div>

      <div style={{ ...labelStyle, marginTop: '12px', marginBottom: '4px' }}>
        Sample receipt PDF
      </div>
      <ReceiptPdfPreview donationId={sampleId} body={templateBody} />
    </div>
  );
}

BulkSamplePreview.propTypes = {
  recipients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      donorFullName: PropTypes.string,
      donorEmail: PropTypes.string,
      first_name: PropTypes.string,
      amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    })
  ),
  sampleId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSampleIdChange: PropTypes.func.isRequired,
  templateBody: PropTypes.string,
};

BulkSamplePreview.defaultProps = {
  recipients: [],
  sampleId: null,
  templateBody: '',
};
