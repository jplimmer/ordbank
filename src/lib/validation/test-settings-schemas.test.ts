import { VALIDATION_LIMITS } from '@/lib/constants/validation';
import { testSettingsUpdateSchema } from '@/lib/validation/test-settings-schemas';
import { describe, expect, it } from 'vitest';

const { MAX_QUESTIONS, MAX_TIME_MINS } = VALIDATION_LIMITS;
const settings = {
  direction: 'random',
  answerMode: 'typed',
  questionLimit: 10,
  timeLimitMins: 5,
};

const isValid = (overrides: Record<string, unknown>) =>
  testSettingsUpdateSchema.safeParse({ ...settings, ...overrides }).success;

describe('testSettingsUpdateSchema', () => {
  it.each([
    ['questionLimit', 1, MAX_QUESTIONS],
    ['timeLimitMins', 1, MAX_TIME_MINS],
  ])('accepts %s from %i to %i only', (field, min, max) => {
    expect(isValid({ [field]: min })).toBe(true);
    expect(isValid({ [field]: max })).toBe(true);
    expect(isValid({ [field]: min - 1 })).toBe(false);
    expect(isValid({ [field]: max + 1 })).toBe(false);
  });

  it.each(['questionLimit', 'timeLimitMins'])(
    'accepts no %s, meaning unlimited',
    (field) => {
      expect(isValid({ [field]: null })).toBe(true);
    }
  );

  it.each([
    ['direction', 'sideways'],
    ['answerMode', 'spoken'],
  ])('rejects an unknown %s', (field, value) => {
    expect(isValid({ [field]: value })).toBe(false);
  });

  it('drops id and userId, so settings cannot be moved to another user', () => {
    const result = testSettingsUpdateSchema.parse({
      ...settings,
      id: 1,
      userId: 2,
    });

    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('userId');
  });
});
