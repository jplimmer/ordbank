'use client';

import { useTestManager } from '@/hooks/use-test-manager';
import { TestSettings } from '@/lib/types/test';
import { useEffect, useRef } from 'react';
import { ErrorFallback } from '../fallbacks/error-fallback';
import { TestSettingsForm } from '../test-settings/test-settings-form';
import { ActionButtons } from './action-buttons';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { QuestionCounter } from './question-counter';
import { QuestionPanel } from './question-panel';
import { ResultDisplay } from './result-display';
import { TestSummary } from './test-summary';
import { TestTimer } from './test-timer';
import { TypedAnswer } from './typed-answer';

interface TestManagerProps {
  savedSettings: TestSettings;
}

export function TestManager({ savedSettings }: TestManagerProps) {
  const {
    testState,
    activeSettings,
    startTest,
    setAnswer,
    submitAnswer,
    getNextQuestion,
    endTest,
    reset: resetTest,
    loading,
  } = useTestManager(savedSettings);

  const {
    phase,
    question,
    currentAnswer,
    result,
    currentQuestionIndex,
    score,
    error,
  } = testState;

  const isAnswerDisabled = result !== null || loading;

  // Refs for focus behaviour
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const typedAnswerRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  // Focuses on TypedAnswer component or QuestionPanel when new question loads
  useEffect(() => {
    if (!result && question) {
      if (question.answerMode === 'typed') {
        requestAnimationFrame(() => typedAnswerRef.current?.focus());
      } else {
        questionRef.current?.focus();
      }
    }
  }, [question, result]);

  // Focuses on NextQuestionButton when result returned
  useEffect(() => {
    if (result && !loading) {
      nextButtonRef.current?.focus();
    }
  }, [result, loading]);

  // Show settings form if test not yet started
  if (phase === 'settings') {
    return (
      <TestSettingsForm
        initialSettings={activeSettings}
        onSubmit={startTest}
        isLoading={loading}
      />
    );
  }

  // Show test summary screen if test completed
  if (phase === 'completed') {
    return (
      <TestSummary
        score={score}
        totalQuestions={activeSettings.questionLimit ?? currentQuestionIndex}
        onReset={resetTest}
        isLoading={loading}
      />
    );
  }

  if (!question) {
    return <ErrorFallback />;
  }

  return (
    <div className="grid justify-center gap-12">
      <div className="grid grid-cols-2 items-center font-mono">
        <QuestionCounter
          questionLimit={activeSettings.questionLimit}
          currentQuestion={currentQuestionIndex + 1}
        />
        <TestTimer
          timeLimitMins={activeSettings.timeLimitMins}
          onTimeExpired={endTest}
          className="justify-self-end"
        />
      </div>
      <QuestionPanel
        questionWord={question.question}
        direction={question.direction}
        ref={questionRef}
      />
      {question.answerMode === 'multipleChoice' ? (
        <MultipleChoiceAnswer
          options={question.answers}
          value={currentAnswer}
          onSetAnswer={setAnswer}
          disabled={isAnswerDisabled}
        />
      ) : (
        <TypedAnswer
          value={currentAnswer}
          onSetAnswer={setAnswer}
          onSubmit={submitAnswer}
          disabled={isAnswerDisabled}
          ref={typedAnswerRef}
        />
      )}
      <div className="grid gap-4 w-full">
        {error ? (
          <p className="text-destructive mt-6">{error}</p>
        ) : result ? (
          <ResultDisplay result={result} />
        ) : (
          <div className="h-12" />
        )}
        <ActionButtons
          isAnswered={result !== null}
          onSubmit={submitAnswer}
          onNext={getNextQuestion}
          isLoading={loading}
          onEnd={endTest}
          showEndButton={
            activeSettings.questionLimit !== null ||
            activeSettings.timeLimitMins !== null
          }
          nextButtonRef={nextButtonRef}
        />
      </div>
    </div>
  );
}
