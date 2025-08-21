import { getDefaultLanguages } from '@/lib/language-utils';
import { TestSettingsActionResult } from '@/lib/testSettingsActions';
import SegmentedControl from './SegmentedControl';

interface TestSettingsProps {
  state: TestSettingsActionResult;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}

export default function TestSettingsForm({
  state,
  formAction,
  isPending,
}: TestSettingsProps) {
  const { source, target } = getDefaultLanguages();

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-center">Test Settings</h1>
      <form action={formAction} className="space-y-4">
        <SegmentedControl
          label="Test Length"
          options={['Timed', 'Questions', 'Unlimited']}
          defaultIndex={2}
        />
        {/* <input
          type="text"
          disabled={false}
          placeholder=""
          className="border-neutral-700"
        /> */}

        <SegmentedControl
          label="TestFormat"
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
