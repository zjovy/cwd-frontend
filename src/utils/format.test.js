import { afterEach, describe, expect, it, vi } from 'vitest';

import { formatRelativeTime } from '@/utils/format';

describe('formatRelativeTime', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for less than 60 seconds', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T12:00:30Z'));
    expect(formatRelativeTime('2026-05-18T12:00:00Z')).toBe('Just now');
  });

  it('returns minutes for 1-59 minutes elapsed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T12:05:00Z'));
    expect(formatRelativeTime('2026-05-18T12:00:00Z')).toBe('5 minutes ago');
  });

  it('returns "1 minutes ago" at exactly 60 seconds', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T12:01:00Z'));
    expect(formatRelativeTime('2026-05-18T12:00:00Z')).toBe('1 minutes ago');
  });

  it('returns hours for 1-23 hours elapsed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-18T15:00:00Z'));
    expect(formatRelativeTime('2026-05-18T12:00:00Z')).toBe('3 hours ago');
  });

  it('returns days for 24+ hours elapsed', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-20T12:00:00Z'));
    expect(formatRelativeTime('2026-05-18T12:00:00Z')).toBe('2 days ago');
  });
});
