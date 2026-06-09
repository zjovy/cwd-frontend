export const EMPTY_DONATION_VIEW_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  amount: '',
  donation_date: '',
  receipt_status: 'pending',
  phone: '',
  address: '',
  description: '',
};

export function fromDonationRow(donation) {
  if (!donation) return { ...EMPTY_DONATION_VIEW_FORM };
  return {
    first_name: donation.first_name ?? '',
    last_name: donation.last_name ?? '',
    email: donation.donorEmail ?? '',
    amount: donation.amount ?? '',
    donation_date: donation.donation_date?.slice(0, 10) ?? '',
    receipt_status: donation.receipt_status ?? 'pending',
    phone: '',
    address: '',
    description: donation.description ?? '',
  };
}
