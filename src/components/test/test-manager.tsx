'use client';

import { useTimer } from '@/hooks/use-timer';
import { getQuestion, processAnswer } from '@/lib/actions/test';
import { getLogger } from '@/lib/logger';
import { AnswerResult, Question, TestSettings } from '@/lib/types/test';
import { useEffect, useRef, useState, useTransition } from 'react';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { QuestionCounter } from './question-counter';
import { QuestionPanel } from './question-panel';
import { ResultPanel } from './result-panel';
import { TestSummary } from './test-summary';
import { Timer } from './timer';
import { TypedAnswer } from './typed-answer';

const logger = getLogger();

interface TestManagerProps {
  settings: TestSettings;
  initialQuestion: Question;
}

export function TestManager({ settings, initialQuestion }: TestManagerProps) {
  // States for test flow
  const [inProgress, setInProgress] = useState<boolean>(true);
  const [question, setQuestion] = useState<Question>(initialQuestion);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  // Loading & error-handling
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, startSubmitTransition] = useTransition();
  const [isLoadingNext, startNextTransition] = useTransition();

  // Refs for focus behaviour
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const typedAnswerRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  // Submits answer for processing and sets result state
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

        if (result.correct) setScore(score + 1);

        const nextQuestion = questionCount + 1;
        setQuestionCount(nextQuestion);

        if (settings.questionLimit && nextQuestion >= settings.questionLimit) {
          handleTestEnd();
        }
      } catch (error) {
        logger.error('Error processing answer', error);
        setError('Failed to submit answer. Please try again.');
      }
    });
  };

  // Sets new question state and resets answer and result states
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

  // Sets test status to 'not in progress'
  const handleTestEnd = () => {
    setTimeout(() => {
      setInProgress(false);
    }, 1500);
  };

  // Reset test
  const resetTest = () => {
    logger.info('Reset logic here');
  };

  // Focuses on TypedAnswer component or QuestionPanel when new question loads
  useEffect(() => {
    if (!result) {
      if (question.answerMode === 'typed') {
        typedAnswerRef.current?.focus();
      } else {
        questionRef.current?.focus();
      }
    }
  }, [question, result]);

  // Focuses on NextQuestionButton when result returned
  useEffect(() => {
    if (result && !isLoadingNext) {
      nextButtonRef.current?.focus();
    }
  }, [result, isLoadingNext]);

  // Define parameters for Timer component
  const { seconds } = useTimer({
    timeLimitSecs: settings.timeLimitMins
      ? settings.timeLimitMins * 60
      : undefined,
    onTimeExpired: handleTestEnd,
  });

  // Show test summary screen if test not in progress
  if (!inProgress) {
    return (
      <TestSummary
        score={score}
        totalQuestions={questionCount}
        onReset={resetTest}
      />
    );
  }

  return (
    <div className="grid justify-center gap-12">
      <div className="grid grid-cols-2 items-center font-mono">
        <QuestionCounter
          questionLimit={settings.questionLimit}
          currentQuestion={questionCount}
        />
        <Timer
          seconds={seconds}
          isCountingDown={settings.timeLimitMins !== null}
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
          setAnswer={setCurrentAnswer}
          disabled={result !== null || isSubmitting}
        />
      ) : (
        <TypedAnswer
          value={currentAnswer}
          setAnswer={setCurrentAnswer}
          onSubmit={handleSubmit}
          disabled={result !== null || isSubmitting}
          ref={typedAnswerRef}
        />
      )}
      {error && <p className="text-destructive">{error}</p>}
      <ResultPanel
        result={result}
        submitFn={handleSubmit}
        nextQuestionFn={handleNextQuestion}
        isSubmitting={isSubmitting}
        isLoadingNext={isLoadingNext}
        nextButtonRef={nextButtonRef}
      />
    </div>
  );
}
