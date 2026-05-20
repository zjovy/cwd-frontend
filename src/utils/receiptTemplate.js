export const RECEIPT_SUBJECT = 'Donation Receipt - C&W Market Foundation';

export function formatDonationAmount(amount) {
  const value = Number.parseFloat(amount || 0);
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function buildReceiptMessage(donation) {
  const name = donation.first_name || 'Donor';
  return [
    `Dear ${name},`,
    '',
    `The C&W Market Foundation has received your generous gift of $${formatDonationAmount(donation.amount)} to support our annual efforts.`,
    '',
    'All of us at the C&W Market Foundation appreciate our donors. We are very grateful for your contribution!',
    '',
    'With gratitude,',
    '',
    'Clarence and Wendy Weaver',
    'Co-Founders',
    '',
    'Sydni Craig',
    'Board President',
  ].join('\n');
}
