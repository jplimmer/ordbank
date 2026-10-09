import { VALIDATION_LIMITS } from '@/lib/constants/validation';
import {
  vocabInsertSchema,
  vocabUpdateSchema,
} from '@/lib/validation/vocab-schemas';
import { describe, expect, it } from 'vitest';

const max = VALIDATION_LIMITS.MAX_WORD_LENGTH_CH;
const newItem = { languagePairId: 1, source: 'hund', target: 'dog' };

describe('vocabInsertSchema', () => {
  const isValid = (overrides: Record<string, unknown>) =>
    vocabInsertSchema.safeParse({ ...newItem, ...overrides }).success;

  it('trims and lowercases both words', () => {
    const result = vocabInsertSchema.parse({
      ...newItem,
      source: '  Hund ',
      target: ' DOG  ',
    });

    expect(result).toMatchObject({ source: 'hund', target: 'dog' });
  });

  it.each(['source', 'target'])('rejects an empty or blank %s', (field) => {
    expect(isValid({ [field]: '' })).toBe(false);
    expect(isValid({ [field]: '   ' })).toBe(false);
  });

  it.each(['source', 'target'])(
    `accepts a %s of up to ${max} characters, not counting surrounding spaces`,
    (field) => {
      expect(isValid({ [field]: ` ${'a'.repeat(max)} ` })).toBe(true);
      expect(isValid({ [field]: 'a'.repeat(max + 1) })).toBe(false);
    }
  );

  it('drops attempt stats, so new words start untested', () => {
    const result = vocabInsertSchema.parse({
      ...newItem,
      totalAttempts: 10,
      correctAttempts: 10,
      lastAttemptedAt: new Date(),
    });

    expect(result).not.toHaveProperty('totalAttempts');
    expect(result).not.toHaveProperty('correctAttempts');
    expect(result).not.toHaveProperty('lastAttemptedAt');
  });
});

describe('vocabUpdateSchema', () => {
  const isValid = (update: Record<string, unknown>) =>
    vocabUpdateSchema.safeParse(update).success;

  it('accepts a change to one word only', () => {
    expect(vocabUpdateSchema.parse({ target: ' Hound ' })).toEqual({
      target: 'hound',
    });
  });

  it('applies the same word rules as adding', () => {
    expect(isValid({ source: ' ' })).toBe(false);
    expect(isValid({ source: 'a'.repeat(max + 1) })).toBe(false);
  });

  it('drops languagePairId, so a word cannot move to another pair', () => {
    const result = vocabUpdateSchema.parse({
      languagePairId: 2,
      source: 'katt',
    });

    expect(result).not.toHaveProperty('languagePairId');
  });
});
