export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^\+?[\d\s\-().]{7,20}$/;
export const AMOUNT_RE = /^\d+(\.\d{1,2})?$/;

export function validateDonorFields(form) {
  if (!form.email || !EMAIL_RE.test(form.email))
    return 'Please enter a valid email address';
  if (form.phone && !PHONE_RE.test(form.phone))
    return 'Please enter a valid phone number, e.g. (555) 555-5555';
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
