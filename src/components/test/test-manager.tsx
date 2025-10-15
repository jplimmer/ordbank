'use client';

import { getQuestion } from '@/lib/actions/test';
import { Question, TestSettings } from '@/lib/types/test';
import { useState } from 'react';
import { Button } from '../ui/button';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { QuestionPanel } from './question-panel';
import { TypedAnswer } from './typed-answer';

export function TestManager({ settings }: { settings: TestSettings }) {
  const [question, setQuestion] = useState<Question | undefined>(undefined);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  return (
    <div className="space-y-8">
      <Button
        onClick={async () => {
          const q = await getQuestion(settings.direction, settings.answerMode);
          setQuestion(q);
        }}
      >
        Question
      </Button>
      {question && (
        <div className="space-y§-4">
          <QuestionPanel
            questionWord={question.question}
            direction={question.direction}
          />
          {question.answerMode === 'multipleChoice' ? (
            <MultipleChoiceAnswer
              options={question.answers}
              value={currentAnswer}
              setAnswer={setCurrentAnswer}
            />
          ) : (
            <TypedAnswer value={currentAnswer} setAnswer={setCurrentAnswer} />
          )}
        </div>
      )}
    </div>
  );
}
