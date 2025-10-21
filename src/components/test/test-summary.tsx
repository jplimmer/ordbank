import { useState } from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';

interface TestSummaryProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
  isLoading?: boolean;
}

export function TestSummary({
  score,
  totalQuestions,
  onReset,
  isLoading = false,
}: TestSummaryProps) {
  const messages = ['Well done', 'Good work', 'Nice job'];

  // Select message at random once when component mounts
  const [message] = useState(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  });

  return (
    <div className="flex flex-col gap-12 items-center">
      <span className="text-3xl">Test complete</span>
      <div className="flex flex-col gap-4 items-center">
        <span className="text-2xl">
          Score: {score}/{totalQuestions}
        </span>
        <span className="text-xl">{message}!</span>
      </div>
      <Button
        onClick={onReset}
        disabled={isLoading}
        className="text-lg py-5 min-w-[12rem]"
      >
        {isLoading ? <Spinner /> : 'Test yourself again'}
      </Button>
    </div>
  );
}
