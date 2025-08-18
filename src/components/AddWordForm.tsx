import { addWord } from '@/lib/wordListActions';

export function AddWordForm() {
  return (
    <div className="space-y-4">
      <h2 className="font-bold text-center">Add Word</h2>
      <form action={addWord} className="flex flex-col space-y-4">
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
        <button
          type="submit"
          className="border rounded-lg bg-green-700 text-neutral-200 py-1"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
