import { useState } from 'react';
import { Button } from '../ui/button';

interface TestSummaryProps {
  score: number;
  completedQuestions: number;
  onReset: () => void;
}

export function TestSummary({
  score,
  completedQuestions,
  onReset,
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
          Score: {score}/{completedQuestions}
        </span>
        <span className="text-xl">{message}!</span>
      </div>
      <Button onClick={onReset} className="text-lg py-5">
        Test yourself again
      </Button>
    </div>
  );
}
