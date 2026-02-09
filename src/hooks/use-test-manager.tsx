import { useActivePair } from '@/contexts/language-pair';
import { getQuestion, processAnswer } from '@/lib/actions/test';
import { saveSettings } from '@/lib/actions/test-settings';
import { getLogger } from '@/lib/logger';
import {
  TestAction,
  TestSettings,
  TestState,
  UpdateTestSettings,
} from '@/lib/types/test';
import { useCallback, useReducer, useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';

const logger = getLogger();

// Initial state for reducer & reset
const INITIAL_TEST_STATE: TestState = {
  phase: 'settings',
  question: null,
  currentAnswer: '',
  result: null,
  currentQuestionIndex: 0,
  score: 0,
  error: null,
};

// Reducer to handle state updates from user actions
function testReducer(state: TestState, action: TestAction): TestState {
  switch (action.type) {
    case 'START_TEST': {
      return {
        ...state,
        phase: 'test',
        question: action.payload,
        currentAnswer: '',
        result: null,
        currentQuestionIndex: 0,
      };
    }
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
        currentQuestionIndex: state.currentQuestionIndex + 1,
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
      return { ...state, phase: 'completed' };
    }
    case 'RESET_TEST': {
      return action.payload;
    }
    case 'SET_ERROR': {
      return { ...state, error: action.payload };
    }
  }
}

export const useTestManager = (initialSettings: TestSettings) => {
  const activePair = useActivePair();

  const [testState, dispatch] = useReducer(testReducer, INITIAL_TEST_STATE);
  const [activeSettings, setActiveSettings] =
    useState<UpdateTestSettings>(initialSettings);
  const [loading, startTransition] = useTransition();

  const startTest = (settings: UpdateTestSettings) => {
    startTransition(async () => {
      try {
        setActiveSettings(settings);

        // Save settings to database
        const saveResult = await saveSettings(initialSettings.id, settings);
        if (!saveResult.success) {
          logger.error('Failed to save settings:', saveResult.error);
          toast('Settings only saved temporarily', { icon: '⚙️' });
        }

        const questionResult = await getQuestion(
          activePair.id,
          settings.direction,
          settings.answerMode
        );

        if (!questionResult.success) {
          throw new Error(`Failed to fetch question: ${questionResult.error}`);
        }

        dispatch({ type: 'START_TEST', payload: questionResult.data });
      } catch (error) {
        logger.error('Failed to start test:', error);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Test could not be loaded! Please try refreshing the page.',
        });
      }
    });
  };

  // Callback function for children to update current answer
  const setAnswer = useCallback((value: string) => {
    dispatch({ type: 'SET_ANSWER', payload: value });
  }, []);

  // Submits answer for processing, updates result, score and question count
  const submitAnswer = async () => {
    if (!testState.question) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'Answer submitted when question null',
      });
      return;
    }

    if (!testState.currentAnswer.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please enter an answer' });
      return;
    }

    // Capture current values to avoid dispatch race conditions
    const question = testState.question;
    const currentIndex = testState.currentQuestionIndex;

    dispatch({ type: 'SET_ERROR', payload: null });
    startTransition(async () => {
      try {
        const result = await processAnswer({
          vocabId: question.vocabId,
          direction: question.direction,
          answerString: testState.currentAnswer,
        });

        dispatch({
          type: 'SUBMIT_ANSWER',
          payload: result,
        });

        const isTestEnding =
          activeSettings.questionLimit !== null &&
          currentIndex >= activeSettings.questionLimit - 1;

        if (isTestEnding) endTest();
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
  const getNextQuestion = useCallback(async () => {
    dispatch({ type: 'SET_ERROR', payload: null });
    startTransition(async () => {
      try {
        const nextQuestionResult = await getQuestion(
          activePair.id,
          activeSettings.direction,
          activeSettings.answerMode
        );
        if (!nextQuestionResult.success) {
          throw new Error('Could not fetch next question');
        }
        dispatch({
          type: 'LOAD_NEXT_QUESTION',
          payload: nextQuestionResult.data,
        });
      } catch (error) {
        logger.error('Error loading question', error);
        dispatch({
          type: 'SET_ERROR',
          payload: 'Failed to load next question. Please try again.',
        });
      }
    });
  }, [activePair.id, activeSettings.answerMode, activeSettings.direction]);

  // Moves to 'completed' phase
  const endTest = useCallback(() => {
    dispatch({ type: 'END_TEST' });
  }, []);

  // Resets test to initial state and 'settings' phase
  const reset = useCallback(() => {
    dispatch({ type: 'RESET_TEST', payload: INITIAL_TEST_STATE });
  }, []);

  return {
    testState,
    startTest,
    setAnswer,
    submitAnswer,
    getNextQuestion,
    endTest,
    reset,
    loading,
  };
};
