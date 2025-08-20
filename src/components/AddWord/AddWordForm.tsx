import { WordListActionResult } from '@/lib/wordListActions';

interface AddWordFormProps {
  state: WordListActionResult;
  formAction: (formData: FormData) => void;
  isPending: boolean;
}

export function AddWordForm({
  state,
  formAction,
  isPending,
}: AddWordFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-center">Add Word</h2>
      <form action={formAction} className="flex flex-col space-y-4">
        <label htmlFor="swedish-input" className="flex flex-col space-y-2">
          Swedish:
          <input
            type="text"
            id="swedish-input"
            name="swedish"
            className="border"
            required
            autoFocus
          />
        </label>

        <label htmlFor="english-input" className="flex flex-col space-y-2">
          English:
          <input
            type="text"
            id="english-input"
            name="english"
            className="border"
            required
          />
        </label>

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
          className="border rounded-lg bg-green-700 text-neutral-200 py-1 disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
