import { LanguagePair } from '@/config/languages';
import { TestSettings } from '@/config/test-settings';
import { getDefaultLanguages } from './language-utils';
import { getTestSettings } from './testSettingsActions';

export interface UserProfile {
  languages: LanguagePair;
  testSettings: TestSettings;
}

export function getCurrentUser(): number {
  return 1;
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  const userId = getCurrentUser();

  const { source, target } = getDefaultLanguages(); // Update to take user prefs
  const userTestSettings = await getTestSettings(userId);

  return {
    languages: { source: source, target: target },
    testSettings: userTestSettings,
  };
}
