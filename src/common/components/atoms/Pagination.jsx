/*
  Pagination
  Props:
    page        – current page (1-indexed)
    totalPages  – total number of pages
    onPageChange – (newPage) => void
*/
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 16px;
`;

const Btn = styled.button`
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:focus,
  &:focus-visible {
    outline: none;
  }

  ${({ $active }) =>
    $active &&
    css`
      background: #2563eb;
      border-color: #2563eb;
      color: #fff;
    `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Ellipsis = styled.span`
  min-width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #9ca3af;
`;

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
    <Container>
      <Btn
        type='button'
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        ←
      </Btn>

      {pages.map((p, i) =>
        p === '…' ? (
          <Ellipsis key={`ellipsis-${i}`}>…</Ellipsis>
        ) : (
          <Btn
            key={p}
            type='button'
            $active={p === page}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Btn>
        )
      )}

      <Btn
        type='button'
        onClick={() => onPageChange(page + 1)}
        disabled={page === safeTotal}
      >
        →
      </Btn>
    </Container>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
