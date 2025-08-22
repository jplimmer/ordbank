export const TEST_LENGTH_OPTIONS = ['Time', 'Questions', 'Unlimited'] as const;
export const TEST_FORMAT_OPTIONS = [
  'Typing',
  'Multiple Choice',
  'Both',
] as const;
export const LANGUAGE_DIRECTION_OPTIONS = ['Source', 'Target', 'Both'] as const;

export type TestLength = (typeof TEST_LENGTH_OPTIONS)[number];
export type TestFormat = (typeof TEST_FORMAT_OPTIONS)[number];
export type LanugageDirection = (typeof LANGUAGE_DIRECTION_OPTIONS)[number];

export interface TestSettings {
  testLength: TestLength;
  testFormat: TestFormat;
  languageDirection: LanugageDirection;
}
