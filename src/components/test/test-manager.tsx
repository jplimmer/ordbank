'use client';

import { Question, TestSettings } from '@/lib/types/test';
import { useState } from 'react';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { NextQuestionButton } from './next-question-button';
import { QuestionPanel } from './question-panel';
import { TypedAnswer } from './typed-answer';

interface TestManagerProps {
  settings: TestSettings;
  initialQuestion: Question;
}

export function TestManager({ settings, initialQuestion }: TestManagerProps) {
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  return (
    <div className="space-y-4">
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
      <NextQuestionButton settings={settings} setQuestion={setQuestion} />
    </div>
  );
}
