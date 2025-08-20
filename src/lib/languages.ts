export const LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français' },
  it: { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  sv: { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
