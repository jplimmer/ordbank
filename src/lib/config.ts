import { LanguageCode } from './languages';

export const APP_CONFIG = {
  defaultLanguages: {
    source: 'sv' as LanguageCode,
    target: 'en' as LanguageCode,
  },
} as const;
