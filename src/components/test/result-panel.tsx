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
        <div>
          {result.correct ? (
            <p>Correct!</p>
          ) : (
            <>
              <span className="destructive">Incorrect!</span>
              <p>Correct answer: {result.correctAnswer}</p>
            </>
          )}
          <Button onClick={nextQuestionFn}>Next question</Button>
        </div>
      )}
    </div>
  );
}
