import { RequireLanguagePair } from '@/components/guards/require-language-pair';
import { TestPageManager } from '@/components/test/test-page-manager';
import { getQuestion } from '@/lib/actions/test';
import { getCurrentProfile } from '@/lib/services/auth';
import { getTestSettings } from '@/lib/services/test-settings';
import { notFound } from 'next/navigation';

export default async function TestPage() {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    // TO DO - redirect to login/account page?
    notFound();
  }

  // Fetch user settings from database
  const settingsResult = await getTestSettings(profileCheck.data.userId);
  if (!settingsResult.success) {
    // TO DO - handle fallback (default settings?)
    notFound();
  }
  const settings = settingsResult.data;

  // Generate first question server-side
  const initialQuestion = await getQuestion(
    settings.direction,
    settings.answerMode
  );

  return (
    <div className="full-width content-grid justify-items-center items-center">
      <RequireLanguagePair>
        <TestPageManager
          initialSettings={settings}
          initialQuestion={initialQuestion}
        />
      </RequireLanguagePair>
    </div>
  );
}
