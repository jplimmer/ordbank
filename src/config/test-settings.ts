// Test length options and labels
export const TEST_LENGTH_OPTIONS = ['time', 'questions', 'unlimited'] as const;
export type TestLength = (typeof TEST_LENGTH_OPTIONS)[number];

export const TEST_LENGTH_LABELS: Record<TestLength, string> = {
  time: 'Time',
  questions: 'Questions',
  unlimited: 'Unlimited',
};

// Test format options and labels
export const TEST_FORMAT_OPTIONS = [
  'typing',
  'multiple_choice',
  'both',
] as const;
export type TestFormat = (typeof TEST_FORMAT_OPTIONS)[number];

export const TEST_FORMAT_LABELS: Record<TestFormat, string> = {
  typing: 'Typing',
  multiple_choice: 'Multiple Choice',
  both: 'Both',
};

// Language direction options - labels generated dynamically by page based on UserProfile
export const LANGUAGE_DIRECTION_OPTIONS = ['source', 'target', 'both'] as const;
export type LanguageDirection = (typeof LANGUAGE_DIRECTION_OPTIONS)[number];

// Interface for type-safety in server actions
export interface TestSettings {
  testLength: TestLength;
  testFormat: TestFormat;
  languageDirection: LanguageDirection;
}
