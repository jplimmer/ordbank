'use client';

import { getDefaultLanguages } from '@/lib/language-utils';
import { updateSettings } from '@/lib/testSettingsActions';
import { useActionState } from 'react';
import SegmentedControl from './SegmentedControl';

export default function TestSettingsForm() {
  const [state, formAction, isPending] = useActionState(updateSettings, {
    success: false,
  });
  const { source, target } = getDefaultLanguages();

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
          options={[source.name, target.name, 'Both']}
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
