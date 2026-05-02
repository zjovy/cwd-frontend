/*
  Pagination
  Props:
    page        – current page (1-indexed)
    totalPages  – total number of pages
    onPageChange – (newPage) => void
*/
import PropTypes from 'prop-types';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginTop: '16px',
  },
  btn: {
    minWidth: '34px',
    height: '34px',
    padding: '0 10px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    background: '#fff',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnActive: {
    background: '#2563eb',
    borderColor: '#2563eb',
    color: '#fff',
  },
  btnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  ellipsis: {
    minWidth: '34px',
    height: '34px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    color: '#9ca3af',
  },
};

function getPageNumbers(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const addPage = (n) => pages.push(n);
  const addEllipsis = () => pages.push('…');

  addPage(1);
  if (page > 3) addEllipsis();

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) addPage(i);

  if (page < totalPages - 2) addEllipsis();
  addPage(totalPages);

  return pages;
}

export default function Pagination({ page, totalPages, onPageChange }) {
  const safeTotal =
    typeof totalPages === 'number' && Number.isFinite(totalPages)
      ? totalPages
      : 0;
  if (safeTotal <= 1) return null;

  const pages = getPageNumbers(page, safeTotal);

  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.btn,
          ...(page === 1 ? styles.btnDisabled : {}),
        }}
        type='button'
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} style={styles.ellipsis}>
            …
          </span>
        ) : (
          <button
            key={p}
            type='button'
            style={{
              ...styles.btn,
              ...(p === page ? styles.btnActive : {}),
            }}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        style={{
          ...styles.btn,
          ...(page === safeTotal ? styles.btnDisabled : {}),
        }}
        type='button'
        onClick={() => onPageChange(page + 1)}
        disabled={page === safeTotal}
      >
        →
      </button>
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
