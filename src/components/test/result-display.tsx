import { AnswerResult } from '@/lib/types/test';

export function ResultDisplay({ result }: { result: AnswerResult }) {
  return (
    <>
      {result.correct ? (
        <div>
          <p className="font-semibold text-green-600 mt-6">Correct!</p>
        </div>
      ) : (
        <div>
          <span className="font-semibold text-destructive">Incorrect!</span>
          <p className="text-destructive">
            Correct answer: {result.correctAnswer}
          </p>
        </div>
      )}
    </>
  );
}
