'use client';

import { useTimer } from '@/hooks/use-timer';
import { getQuestion, processAnswer } from '@/lib/actions/test';
import { getLogger } from '@/lib/logger';
import {
  Question,
  TestAction,
  TestState,
  UpdateTestSettings,
} from '@/lib/types/test';
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useTransition,
} from 'react';
import { Timer } from '../ui/timer';
import { ActionButtons } from './action-buttons';
import { MultipleChoiceAnswer } from './multiple-choice-answer';
import { QuestionCounter } from './question-counter';
import { QuestionPanel } from './question-panel';
import { ResultDisplay } from './result-display';
import { TestSummary } from './test-summary';
import { TypedAnswer } from './typed-answer';

const logger = getLogger();

interface TestManagerProps {
  settings: UpdateTestSettings;
  initialQuestion: Question;
}

export function TestManager({ settings, initialQuestion }: TestManagerProps) {
  // Initial state for reducer
  const initialTestState: TestState = {
    inProgress: true,
    question: initialQuestion,
    currentAnswer: '',
    result: null,
    currentQuestion: 1,
    score: 0,
    error: null,
  };

  const [testState, dispatch] = useReducer(testReducer, initialTestState);
  const {
    question,
    currentAnswer,
    result,
    currentQuestion,
    score,
    error,
    inProgress,
  } = testState;

  // Transitions for loading
  const [isLoading, startTransition] = useTransition();
  const isAnswerDisabled = result !== null || isLoading;

  // Refs for focus behaviour
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const typedAnswerRef = useRef<HTMLInputElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);

  // Callback function for children to update current answer
  const setAnswer = (value: string) => {
    dispatch({ type: 'SET_ANSWER', payload: value });
  };

  // Submits answer for processing, updates result, score and question count
  const handleSubmit = async () => {
    if (!currentAnswer.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter an answer' });
      return;
    }

    dispatch({ type: 'SET_ERROR', payload: null });
    startTransition(async () => {
      try {
        const result = await processAnswer({
          vocabId: question.vocabId,
          direction: question.direction,
          answerString: currentAnswer,
        });

        dispatch({
          type: 'SUBMIT_ANSWER',
          payload: result,
        });

        const isTestEnding =
          settings.questionLimit !== null &&
          currentQuestion >= settings.questionLimit;

        if (isTestEnding) handleTestEnd();
      } catch (error) {
        logger.error('Error processing answer', error);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to submit answer. Please try again.',
        });
      }
    });
  };

  // Loads next question and resets currentAnswer and result
  const handleNextQuestion = async () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    startTransition(async () => {
      try {
        const nextQuestion = await getQuestion(
          settings.direction,
          settings.answerMode
        );
        dispatch({ type: 'LOAD_NEXT_QUESTION', payload: nextQuestion });
      } catch (error) {
        logger.error('Error loading question', error);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to load next question. Please try again.',
        });
      }
    });
  };

  // Sets test state 'inProgress' to false, with a delay for user to see final result
  const handleTestEnd = useCallback(() => {
    startTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch({ type: 'END_TEST' });
    });
  }, []);

  // Resets test to initial state
  const handleReset = () => {
    startTransition(async () => {
      // Reset timer
      reset();
      // Get new initial question and pass to reducer
      const newQuestion = await getQuestion(
        settings.direction,
        settings.answerMode
      );
      dispatch({
        type: 'RESET_TEST',
        payload: { ...initialTestState, question: newQuestion },
      });
    });
  };

  // Focuses on TypedAnswer component or QuestionPanel when new question loads
  useEffect(() => {
    if (!result) {
      if (question.answerMode === 'typed') {
        requestAnimationFrame(() => typedAnswerRef.current?.focus());
      } else {
        questionRef.current?.focus();
      }
    }
  }, [question, result]);

  // Focuses on NextQuestionButton when result returned
  useEffect(() => {
    if (result && !isLoading) {
      nextButtonRef.current?.focus();
    }
  }, [result, isLoading]);

  // Define parameters for Timer component
  const { seconds, reset } = useTimer({
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
        totalQuestions={settings.questionLimit ?? currentQuestion - 1}
        onReset={handleReset}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="grid justify-center gap-12">
      <div className="grid grid-cols-2 items-center font-mono">
        <QuestionCounter
          questionLimit={settings.questionLimit}
          currentQuestion={currentQuestion}
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
          onSetAnswer={setAnswer}
          disabled={isAnswerDisabled}
        />
      ) : (
        <TypedAnswer
          value={currentAnswer}
          onSetAnswer={setAnswer}
          onSubmit={handleSubmit}
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
          onSubmit={handleSubmit}
          onNext={handleNextQuestion}
          isLoading={isLoading}
          onEnd={handleTestEnd}
          showEndButton={
            settings.questionLimit !== null || settings.timeLimitMins !== null
          }
          nextButtonRef={nextButtonRef}
        />
      </div>
    </div>
  );
}

// Reducer to handle state updates from user actions
function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'SET_ANSWER': {
      return {
        ...state,
        currentAnswer: action.payload,
      };
    }
    case 'SUBMIT_ANSWER': {
      return {
        ...state,
        result: action.payload,
        score: action.payload.correct ? state.score + 1 : state.score,
        currentQuestion: state.currentQuestion + 1,
        error: null,
      };
    }
    case 'LOAD_NEXT_QUESTION': {
      return {
        ...state,
        question: action.payload,
        currentAnswer: '',
        result: null,
      };
    }
    case 'END_TEST': {
      return { ...state, inProgress: false };
    }
    case 'RESET_TEST': {
      return action.payload;
    }
    case 'SET_ERROR': {
      return { ...state, error: action.payload };
    }
  }
}
