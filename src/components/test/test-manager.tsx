'use client';

import { getQuestion } from '@/lib/actions/test';
import { Question, TestSettings } from '@/lib/types/test';
import { useState } from 'react';
import { Button } from '../ui/button';
import { QuestionPanel } from './question';

export function TestManager({ settings }: { settings: TestSettings }) {
  const [question, setQuestion] = useState<Question | undefined>(undefined);

  return (
    <div className="space-y-4">
      <Button
        onClick={async () => {
          const q = await getQuestion(settings.direction, settings.answerMode);
          setQuestion(q);
        }}
      >
        Question
      </Button>
      {question && (
        <QuestionPanel
          questionWord={question.question}
          direction={question.direction}
        />
      )}
    </div>
  );
}
