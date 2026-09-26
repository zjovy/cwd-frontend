import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import DonationTable from './DonationTable';

const row = {
  id: 1,
  donor_id: 9,
  donorFullName: 'Ada Lovelace',
  donorEmail: 'ada@example.com',
  amount: 50,
  donation_date: '2026-09-01',
  receipt_status: 'pending',
  description: 'Gala',
  source: 'stripe',
};

function renderTable(donations) {
  return render(
    <MemoryRouter>
      <DonationTable donations={donations} loading={false} error={null} />
    </MemoryRouter>
  );
}

describe('DonationTable source column', () => {
  it('shows a Source header and Stripe badge for stripe rows', () => {
    renderTable([row]);
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Stripe')).toBeInTheDocument();
  });

  it('shows a Manual badge for manual rows', () => {
    renderTable([{ ...row, source: 'manual' }]);
    expect(screen.getByText('Manual')).toBeInTheDocument();
  });
});
