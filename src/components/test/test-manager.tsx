'use client';

import { useTestManager } from '@/hooks/use-test-manager';
import { useTimer } from '@/hooks/use-timer';
import { TestSettings } from '@/lib/types/test';
import { useEffect, useRef } from 'react';
import { ErrorFallback } from '../fallbacks/error-fallback';
import { TestSettingsForm } from '../test-settings/test-settings-form';
import { Timer } from '../ui/timer';
import { ActionButtons } from './action-buttons';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { QuestionCounter } from './question-counter';
import { QuestionPanel } from './question-panel';
import { ResultDisplay } from './result-display';
import { TestSummary } from './test-summary';
import { TypedAnswer } from './typed-answer';

interface TestManagerProps {
  initialSettings: TestSettings;
}

export function TestManager({ initialSettings }: TestManagerProps) {
  const {
    testState,
    startTest,
    setAnswer,
    submitAnswer,
    getNextQuestion,
    endTest,
    reset: resetTest,
    loading,
  } = useTestManager(initialSettings);

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

  // Define parameters for Timer component
  const { seconds, reset: resetTimer } = useTimer({
    timeLimitSecs: initialSettings.timeLimitMins
      ? initialSettings.timeLimitMins * 60
      : undefined,
    onTimeExpired: endTest,
  });

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

  // Resets both timer and test
  const handleReset = () => {
    resetTimer();
    resetTest();
  };

  // Ends test after a short delay, so user can see the final result
  const handleEndTest = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    endTest();
  };

  // Show settings form if test not yet started
  if (phase === 'settings') {
    return (
      <TestSettingsForm
        initialSettings={initialSettings}
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
        totalQuestions={initialSettings.questionLimit ?? currentQuestionIndex}
        onReset={handleReset}
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
          questionLimit={initialSettings.questionLimit}
          currentQuestion={currentQuestionIndex + 1}
        />
        <Timer
          seconds={seconds}
          isCountingDown={initialSettings.timeLimitMins !== null}
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
          onEnd={handleEndTest}
          showEndButton={
            initialSettings.questionLimit !== null ||
            initialSettings.timeLimitMins !== null
          }
          nextButtonRef={nextButtonRef}
        />
      </div>
    </div>
  );
}
