export const RECEIPT_SUBJECT = 'Donation Receipt - C&W Market Foundation';

export const RECEIPT_FIRST_NAME_PLACEHOLDER = '{{first_name}}';
export const RECEIPT_AMOUNT_PLACEHOLDER = '{{amount}}';

const RECEIPT_PLACEHOLDER_META = [
  {
    id: 'first_name',
    token: RECEIPT_FIRST_NAME_PLACEHOLDER,
    editToken: "[Donor's first name]",
    label: "Donor's first name",
    pill: { background: '#dbeafe', color: '#1e40af', border: '#93c5fd' },
  },
  {
    id: 'amount',
    token: RECEIPT_AMOUNT_PLACEHOLDER,
    editToken: '[Donation amount]',
    label: 'Donation amount',
    pill: { background: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  },
];

const PLACEHOLDER_BY_ID = Object.fromEntries(
  RECEIPT_PLACEHOLDER_META.map((meta) => [meta.id, meta])
);

export function getReceiptPlaceholderMeta(id) {
  return PLACEHOLDER_BY_ID[id];
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function templateToEditText(template) {
  let text = String(template);
  for (const { token, editToken } of RECEIPT_PLACEHOLDER_META) {
    text = text.replaceAll(token, editToken);
  }
  return text;
}

export function editTextToTemplate(text) {
  let out = String(text);
  for (const { token, editToken } of RECEIPT_PLACEHOLDER_META) {
    out = out.replaceAll(editToken, token);
  }
  return out;
}

export function splitMessageParts(text) {
  const lookup = new Map();
  const alternates = [];
  for (const meta of RECEIPT_PLACEHOLDER_META) {
    lookup.set(meta.token, meta);
    lookup.set(meta.editToken, meta);
    alternates.push(escapeRegExp(meta.token), escapeRegExp(meta.editToken));
  }

  if (!text) return [];

  const regex = new RegExp(`(${alternates.join('|')})`, 'g');
  const parts = [];
  let last = 0;

  for (const match of text.matchAll(regex)) {
    if (match.index > last) {
      parts.push({ type: 'text', value: text.slice(last, match.index) });
    }
    const meta = lookup.get(match[0]);
    parts.push({ type: 'placeholder', id: meta.id });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push({ type: 'text', value: text.slice(last) });
  }

  return parts;
}

export function formatDonationAmount(amount) {
  const value = Number.parseFloat(amount || 0);
  return value.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

export function buildReceiptMessageTemplate() {
  return [
    `Dear ${RECEIPT_FIRST_NAME_PLACEHOLDER},`,
    '',
    `The C&W Market Foundation has received your generous gift of $${RECEIPT_AMOUNT_PLACEHOLDER} to support our annual efforts.`,
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

export function applyReceiptTemplate(template, donation) {
  const name = donation?.first_name || 'Donor';
  const amount = formatDonationAmount(donation?.amount);
  return String(template)
    .replaceAll(RECEIPT_FIRST_NAME_PLACEHOLDER, name)
    .replaceAll(RECEIPT_AMOUNT_PLACEHOLDER, amount);
}

export function buildReceiptMessage(donation) {
  return applyReceiptTemplate(buildReceiptMessageTemplate(), donation);
}
