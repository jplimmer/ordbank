import { LanguagePair } from './languages';
import { TestSettings } from './test-settings';

interface APP_CONFIG {
  defaultLanguages: LanguagePair;
  defaultTestSettings: TestSettings;
}

export const APP_CONFIG: APP_CONFIG = {
  defaultLanguages: {
    source: 'sv',
    target: 'en',
  },
  defaultTestSettings: {
    testLength: 'unlimited',
    testFormat: 'multiple_choice',
    languageDirection: 'both',
  },
} as const;
