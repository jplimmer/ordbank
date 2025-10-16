import { useState } from 'react';

interface TestSummaryProps {
  score: number;
  totalQuestions: number;
}

export function TestSummary({ score, totalQuestions }: TestSummaryProps) {
  const messages = ['Well done', 'Good work', 'Nice job'];

  // Select message at random once when component mounts
  const [message] = useState(() => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  });

  return (
    <div className="flex flex-col gap-4 items-center">
      <span>Test complete!</span>
      <span>
        Score: {score}/{totalQuestions}
      </span>
      <span>{message}</span>
    </div>
  );
}
