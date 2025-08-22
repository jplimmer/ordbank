'use client';

import { LANGUAGES } from '@/config/languages';
import { updateTestSettings } from '@/lib/testSettingsActions';
import { UserProfile } from '@/lib/user';
import { useActionState } from 'react';
import SegmentedControl from './SegmentedControl';

export default function TestSettingsForm({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const [state, formAction, isPending] = useActionState(updateTestSettings, {
    success: false,
  });

  const { source, target } = userProfile.languages;
  const sourceLanguage = LANGUAGES[source].name;
  const targetLanguage = LANGUAGES[target].name;

  // const { testLength, testFormat, languageDirection } =
  //   userProfile.testSettings;

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-center">Test Settings</h1>
      <form action={formAction} className="flex flex-col space-y-4">
        <SegmentedControl
          label="Test Length"
          options={['Time', 'Questions', 'Unlimited']}
          defaultIndex={2}
        />
        {/* <input
          type="text"
          disabled={false}
          placeholder=""
          className="border-neutral-700"
        /> */}

        <SegmentedControl
          label="Test Format"
          options={['Typing', 'Multiple Choice', 'Both']}
          defaultIndex={1}
        />

        <SegmentedControl
          label="Language Direction"
          options={[sourceLanguage, targetLanguage, 'Both']}
          defaultIndex={2}
        />

        {state.message && (
          <p
            className={`text-sm ${
              state.success ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="cursor-pointer bg-green-600 rounded-lg px-8 py-2 text-white disabled:opacity-50"
        >
          {isPending ? 'Loading test...' : 'Start test!'}
        </button>
      </form>
    </div>
  );
}
