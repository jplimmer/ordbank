'use client';

import { Question, TestSettings } from '@/lib/types/test';
import { useState } from 'react';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { QuestionPanel } from './question-panel';
import { ResultPanel } from './result-panel';
import { TypedAnswer } from './typed-answer';

interface TestManagerProps {
  settings: TestSettings;
  initialQuestion: Question;
}

export function TestManager({ settings, initialQuestion }: TestManagerProps) {
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  const resetCurrentAnswer = () => setCurrentAnswer('');

  return (
    <div className="grid justify-center items-center gap-16">
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
      <ResultPanel
        settings={settings}
        setQuestion={setQuestion}
        resetAnswer={resetCurrentAnswer}
        vocabId={question.vocabId}
        direction={question.direction}
        answer={currentAnswer}
      />
    </div>
  );
}
