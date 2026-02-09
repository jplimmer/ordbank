import { NoLanguagePairFallback } from '@/components/fallbacks/no-language-pair-fallback';
import { NoTestSettingsFallback } from '@/components/fallbacks/no-test-settings-fallback';
import { RequireActivePairContext } from '@/components/guards/require-active-pair-context';
import { TestManager } from '@/components/test/test-manager';
import { getCurrentUserOrRedirect } from '@/lib/services/auth';
import {
  createUserTestSettingsInDb,
  getTestSettings,
} from '@/lib/services/test-settings';
import { TestSettings } from '@/lib/types/test';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Test Yourself',
  description: 'Test your vocabulary knowledge',
};

export default async function TestPage() {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  if (!user.activeLanguagePairId) {
    return (
      <div className="full-width content-grid justify-items-center items-start">
        <NoLanguagePairFallback />
      </div>
    );
  }

  // Fetch user settings from database, with fallback
  let settings: TestSettings;
  const settingsResult = await getTestSettings(user.id);
  if (settingsResult.success) {
    // Use database settings
    settings = settingsResult.data;
  } else if (settingsResult.error.code === 'NOT_FOUND') {
    // If database settings not found, try creating user settings
    const createResult = await createUserTestSettingsInDb(user.id);
    if (createResult.success) {
      // Use newly-created default settings
      settings = createResult.data;
    } else {
      return (
        <div className="full-width content-grid justify-items-center items-start">
          <NoTestSettingsFallback />
        </div>
      );
    }
  } else {
    return (
      <div className="full-width content-grid justify-items-center items-start">
        <NoTestSettingsFallback />
      </div>
    );
  }

  return (
    <div className="full-width content-grid justify-items-center items-center">
      <RequireActivePairContext>
        <TestManager initialSettings={settings} />
      </RequireActivePairContext>
    </div>
  );
}
