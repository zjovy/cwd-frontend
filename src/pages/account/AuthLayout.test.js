import { describe, expect, it } from 'vitest';
import {
  mapAuthCodeToMessage,
  mapResetErrorCodeToMessage,
} from './AuthLayout';

describe('mapAuthCodeToMessage', () => {
  it('maps auth/invalid-email', () => {
    expect(mapAuthCodeToMessage('auth/invalid-email')).toBe(
      'Please enter a valid email address.'
    );
  });

  it('maps auth/invalid-credential', () => {
    expect(mapAuthCodeToMessage('auth/invalid-credential')).toBe(
      'Email or password is incorrect. Please try again.'
    );
  });

  it('maps auth/popup-closed-by-user', () => {
    expect(mapAuthCodeToMessage('auth/popup-closed-by-user')).toBe(
      'Sign-in popup was closed. Please try again.'
    );
  });

  it('returns fallback for unknown codes', () => {
    expect(mapAuthCodeToMessage('auth/unknown-code')).toBe(
      'An unexpected error occurred. Please try again.'
    );
  });

  it('returns fallback for undefined', () => {
    expect(mapAuthCodeToMessage(undefined)).toBe(
      'An unexpected error occurred. Please try again.'
    );
  });
});

describe('mapResetErrorCodeToMessage', () => {
  it('maps auth/invalid-email', () => {
    expect(mapResetErrorCodeToMessage('auth/invalid-email')).toBe(
      'Please enter a valid email address.'
    );
  });

  it('maps auth/user-not-found', () => {
    expect(mapResetErrorCodeToMessage('auth/user-not-found')).toBe(
      'No account found with that email address.'
    );
  });

  it('maps auth/too-many-requests', () => {
    expect(mapResetErrorCodeToMessage('auth/too-many-requests')).toBe(
      'Too many attempts. Please wait before trying again.'
    );
  });

  it('returns fallback for unknown codes', () => {
    expect(mapResetErrorCodeToMessage('auth/unknown')).toBe(
      'An unexpected error occurred. Please try again.'
    );
  });
});
