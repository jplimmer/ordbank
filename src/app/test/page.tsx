import { TestManager } from '@/components/test/test-manager';
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
    <div className="grid justify-center items-center">
      <TestManager settings={settings} initialQuestion={initialQuestion} />
    </div>
  );
}
