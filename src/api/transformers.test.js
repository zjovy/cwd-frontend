import { transformDonation, transformDonor } from '@/api/transformers';
import { describe, expect, it } from 'vitest';

describe('transformDonation source', () => {
  it('keeps backend source stripe', () => {
    expect(
      transformDonation({
        first_name: 'Ada',
        last_name: 'Lovelace',
        email: 'ada@example.com',
        source: 'stripe',
        stripe_payment_intent_id: 'pi_123',
      }).source
    ).toBe('stripe');
  });

  it('keeps backend source manual', () => {
    expect(
      transformDonation({
        first_name: 'Ada',
        last_name: 'Lovelace',
        email: 'ada@example.com',
        source: 'manual',
        stripe_payment_intent_id: null,
      }).source
    ).toBe('manual');
  });

  it('derives stripe from a payment intent id when source is missing', () => {
    expect(
      transformDonation({
        first_name: 'Ada',
        last_name: 'Lovelace',
        stripe_payment_intent_id: 'pi_123',
      }).source
    ).toBe('stripe');
  });

  it('derives manual when the payment intent id is null', () => {
    expect(
      transformDonation({
        first_name: 'Ada',
        last_name: 'Lovelace',
        stripe_payment_intent_id: null,
      }).source
    ).toBe('manual');
  });

  it('derives manual when the payment intent id is blank or whitespace', () => {
    expect(
      transformDonation({
        first_name: 'Ada',
        last_name: 'Lovelace',
        stripe_payment_intent_id: '   ',
      }).source
    ).toBe('manual');
  });
});

describe('transformDonor nested donations', () => {
  it('normalizes source on nested donation rows', () => {
    const donor = transformDonor({
      first_name: 'Ada',
      last_name: 'Lovelace',
      donations: [{ id: 1, stripe_payment_intent_id: 'pi_123' }],
    });
    expect(donor.donations[0].source).toBe('stripe');
  });
});
