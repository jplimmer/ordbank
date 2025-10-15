'use client';

import { getQuestion, processAnswer } from '@/lib/actions/test';
import { AnswerResult, Question, TestSettings } from '@/lib/types/test';
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
  const [result, setResult] = useState<AnswerResult | null>(null);

  const handleSubmit = async () => {
    if (!currentAnswer) {
      alert('Please enter an answer');
      return;
    }
    const result = await processAnswer({
      vocabId: question.vocabId,
      direction: question.direction,
      answerString: currentAnswer,
    });
    setResult(result);
  };

  const handleNextQuestion = async () => {
    const q = await getQuestion(settings.direction, settings.answerMode);
    setQuestion(q);
    setCurrentAnswer('');
    setResult(null);
  };

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
          disabled={result !== null}
        />
      ) : (
        <TypedAnswer
          value={currentAnswer}
          setAnswer={setCurrentAnswer}
          disabled={result !== null}
        />
      )}
      <ResultPanel
        result={result}
        submitFn={handleSubmit}
        nextQuestionFn={handleNextQuestion}
      />
    </div>
  );
}
