export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const AMOUNT_RE = /^\d+(\.\d{1,2})?$/;

export function validateDonorFields(form) {
  if (!form.email || !EMAIL_RE.test(form.email))
    return 'Please enter a valid email address';
  if (form.phone) {
    if (/[^\d+() -]/.test(form.phone))
      return 'Please enter a valid phone number';
    if (form.phone.replace(/\D/g, '').length < 7)
      return 'Please enter a valid phone number';
  }
  return null;
}

export function validateDonationFields(form, isEdit) {
  if (!isEdit) {
    const donorError = validateDonorFields(form);
    if (donorError) return donorError;
  }
  if (!form.donation_date) return 'Donation date is required';
  const amount = parseFloat(form.amount);
  if (!form.amount || isNaN(amount) || amount <= 0)
    return 'Amount must be a positive number';
  if (!AMOUNT_RE.test(String(form.amount)))
    return 'Amount must have at most 2 decimal places';
  return null;
}
