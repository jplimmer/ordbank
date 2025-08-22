import { LanguageSettings } from './languages';
import { TestSettings } from './test-settings';

interface APP_CONFIG {
  defaultLanguages: LanguageSettings;
  defaultTestSettings: TestSettings;
}

export const APP_CONFIG: APP_CONFIG = {
  defaultLanguages: {
    source: 'sv',
    target: 'en',
  },
  defaultTestSettings: {
    testLength: 'Unlimited',
    testFormat: 'Multiple Choice',
    languageDirection: 'Both',
  },
} as const;
