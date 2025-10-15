'use client';

import { getQuestion, processAnswer } from '@/lib/actions/test';
import { getLogger } from '@/lib/logger';
import { AnswerResult, Question, TestSettings } from '@/lib/types/test';
import { useState, useTransition } from 'react';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { QuestionPanel } from './question-panel';
import { ResultPanel } from './result-panel';
import { TypedAnswer } from './typed-answer';

const logger = getLogger();

interface TestManagerProps {
  settings: TestSettings;
  initialQuestion: Question;
}

export function TestManager({ settings, initialQuestion }: TestManagerProps) {
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isLoadingNext, startNextTransition] = useTransition();

  const handleSubmit = async () => {
    if (!currentAnswer.trim()) {
      setError('Please enter an answer');
      return;
    }

    setError(null);
    startSubmitTransition(async () => {
      try {
        const result = await processAnswer({
          vocabId: question.vocabId,
          direction: question.direction,
          answerString: currentAnswer,
        });
        setResult(result);
      } catch (error) {
        logger.error('Error processing answer', error);
        setError('Failed to submit answer. Please try again.');
      }
    });
  };

  const handleNextQuestion = async () => {
    startNextTransition(async () => {
      try {
        const q = await getQuestion(settings.direction, settings.answerMode);
        setQuestion(q);
        setCurrentAnswer('');
        setResult(null);
      } catch (error) {
        logger.error('Error loading question', error);
        setError('Failed to load next question. Please try again.');
      }
    });
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
          disabled={result !== null || isSubmitting}
        />
      ) : (
        <TypedAnswer
          value={currentAnswer}
          setAnswer={setCurrentAnswer}
          disabled={result !== null || isSubmitting}
        />
      )}
      {error && <p className="text-destructive">{error}</p>}
      <ResultPanel
        result={result}
        submitFn={handleSubmit}
        nextQuestionFn={handleNextQuestion}
        isSubmitting={isSubmitting}
        isLoadingNext={isLoadingNext}
      />
    </div>
  );
}
