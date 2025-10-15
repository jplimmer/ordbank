'use client';

import { AnswerResult } from '@/lib/types/test';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface ResultPanelProps {
  result: AnswerResult | null;
  submitFn: () => void;
  nextQuestionFn: () => void;
  isSubmitting: boolean;
  isLoadingNext: boolean;
}

export function ResultPanel({
  result,
  submitFn,
  nextQuestionFn,
  isSubmitting,
  isLoadingNext,
}: ResultPanelProps) {
  return (
    <div className="grid">
      {!result ? (
        <Button onClick={submitFn} disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : 'Submit'}
        </Button>
      ) : (
        <div className="grid gap-2">
          {result.correct ? (
            <p className="text-lg text-green-600">Correct!</p>
          ) : (
            <>
              <span className="text-lg text-destructive font-semibold">
                Incorrect!
              </span>
              <p className="text-destructive">
                Correct answer: {result.correctAnswer}
              </p>
            </>
          )}
          <Button onClick={nextQuestionFn} disabled={isLoadingNext} autoFocus>
            {isLoadingNext ? <Spinner /> : 'Next question'}
          </Button>
        </div>
      )}
    </div>
  );
}
