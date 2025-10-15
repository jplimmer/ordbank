'use client';

import { AnswerResult } from '@/lib/types/test';
import { RefObject } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface ResultPanelProps {
  result: AnswerResult | null;
  submitFn: () => void;
  nextQuestionFn: () => void;
  isSubmitting: boolean;
  isLoadingNext: boolean;
  nextButtonRef?: RefObject<HTMLButtonElement | null>;
}

export function ResultPanel({
  result,
  submitFn,
  nextQuestionFn,
  isSubmitting,
  isLoadingNext,
  nextButtonRef,
}: ResultPanelProps) {
  const buttonStyle = 'text-lg py-5';

  return (
    <div className="grid text-xl">
      {!result ? (
        <div className="grid gap-2">
          <div>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
          </div>
          <Button
            onClick={submitFn}
            disabled={isSubmitting}
            className={buttonStyle}
          >
            {isSubmitting ? <Spinner /> : 'Submit'}
          </Button>
        </div>
      ) : (
        <div className="grid gap-2">
          {result.correct ? (
            <div>
              <p>&nbsp;</p>
              <p className="font-semibold text-green-600">Correct!</p>
            </div>
          ) : (
            <div>
              <span className="font-semibold text-destructive">Incorrect!</span>
              <p className="text-destructive">
                Correct answer: {result.correctAnswer}
              </p>
            </div>
          )}
          <Button
            onClick={nextQuestionFn}
            disabled={isLoadingNext}
            className={buttonStyle}
            ref={nextButtonRef}
          >
            {isLoadingNext ? <Spinner /> : 'Next question'}
          </Button>
        </div>
      )}
    </div>
  );
}
