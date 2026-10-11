import { VALIDATION_LIMITS } from '@/lib/constants/validation';
import { languagePairInsertSchema } from '@/lib/validation/language-pair-schemas';
import { describe, expect, it } from 'vitest';

const max = VALIDATION_LIMITS.MAX_LANGUAGE_NAME_LENGTH_CH;
const newPair = { sourceLanguage: 'swedish', targetLanguage: 'english' };

const isValid = (overrides: Record<string, unknown>) =>
  languagePairInsertSchema.safeParse({ ...newPair, ...overrides }).success;

describe('languagePairInsertSchema', () => {
  it('trims and lowercases both language names', () => {
    const result = languagePairInsertSchema.parse({
      sourceLanguage: ' Swedish ',
      targetLanguage: '  ENGLISH ',
    });

    expect(result).toMatchObject(newPair);
  });

  it.each(['sourceLanguage', 'targetLanguage'])(
    'rejects an empty or blank %s',
    (field) => {
      expect(isValid({ [field]: '' })).toBe(false);
      expect(isValid({ [field]: '   ' })).toBe(false);
    }
  );

  it.each(['sourceLanguage', 'targetLanguage'])(
    `accepts a %s of up to ${max} characters`,
    (field) => {
      expect(isValid({ [field]: 'a'.repeat(max) })).toBe(true);
      expect(isValid({ [field]: 'a'.repeat(max + 1) })).toBe(false);
    }
  );

  it('drops userId and pairName, which the server sets', () => {
    const result = languagePairInsertSchema.parse({
      ...newPair,
      userId: 2,
      pairName: 'XXX-YYY',
    });

    expect(result).not.toHaveProperty('userId');
    expect(result).not.toHaveProperty('pairName');
  });
});
