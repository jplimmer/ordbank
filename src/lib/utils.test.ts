import { formatTime } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

describe('formatTime', () => {
  it.each([
    [0, '00:00'],
    [59, '00:59'],
    [60, '01:00'],
    [3599, '59:59'],
  ])('shows %i seconds as mm:ss under an hour', (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected);
  });

  it.each([
    [3600, '01:00:00'],
    [3661, '01:01:01'],
  ])('adds hours from one hour: %i seconds', (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected);
  });
});
