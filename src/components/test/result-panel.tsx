'use client';

import { AnswerResult } from '@/lib/types/test';
import { Button } from '../ui/button';

interface ResultPanelProps {
  result: AnswerResult | null;
  submitFn: () => void;
  nextQuestionFn: () => void;
}

export function ResultPanel({
  result,
  submitFn,
  nextQuestionFn,
}: ResultPanelProps) {
  return (
    <div className="grid">
      {!result ? (
        <Button onClick={submitFn}>Submit</Button>
      ) : (
        <div className="grid gap-2">
          {result.correct ? (
            <p>Correct!</p>
          ) : (
            <>
              <span>Incorrect!</span>
              <p>Correct answer: {result.correctAnswer}</p>
            </>
          )}
          <Button onClick={nextQuestionFn}>Next question</Button>
        </div>
      )}
    </div>
  );
}
