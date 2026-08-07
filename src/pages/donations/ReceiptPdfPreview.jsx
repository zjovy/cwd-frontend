import { useEffect, useState } from 'react';

import donationService from '@/services/donationService';
import PropTypes from 'prop-types';

const frameWrap = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  overflow: 'hidden',
  background: '#f9fafb',
  minHeight: '320px',
};

const statusStyle = {
  fontSize: '13px',
  color: '#6b7280',
  padding: '24px 12px',
  textAlign: 'center',
};

const errorStyle = {
  ...statusStyle,
  color: '#b91c1c',
};

const iframeStyle = {
  display: 'block',
  width: '100%',
  height: '360px',
  border: 'none',
  background: '#fff',
};

export default function ReceiptPdfPreview({ donationId, body }) {
  const [objectUrl, setObjectUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!donationId) {
      setObjectUrl(null);
      setError(null);
      setLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false;

    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      donationService
        .getReceiptPdf(donationId, body, controller.signal)
        .then((blob) => {
          if (cancelled) return;
          const nextUrl = URL.createObjectURL(blob);
          setObjectUrl(nextUrl);
        })
        .catch((err) => {
          if (cancelled || err?.name === 'AbortError') return;
          console.error('[ReceiptPdfPreview] load failed:', err);
          setObjectUrl(null);
          setError(err.message || 'Failed to load PDF preview.');
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [donationId, body]);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  if (!donationId) {
    return (
      <div style={statusStyle}>Select a recipient to preview the PDF.</div>
    );
  }

  return (
    <div style={frameWrap}>
      {loading && !objectUrl && (
        <div style={statusStyle}>Loading PDF preview…</div>
      )}
      {error && <div style={errorStyle}>{error}</div>}
      {!error && objectUrl && (
        <iframe
          title='Receipt PDF preview'
          src={objectUrl}
          style={iframeStyle}
        />
      )}
      {loading && objectUrl && (
        <div style={{ ...statusStyle, padding: '8px 12px' }}>
          Updating PDF preview…
        </div>
      )}
    </div>
  );
}

ReceiptPdfPreview.propTypes = {
  donationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  body: PropTypes.string,
};

ReceiptPdfPreview.defaultProps = {
  donationId: null,
  body: null,
};
