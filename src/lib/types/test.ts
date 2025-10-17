import { z } from 'zod';
import {
  testSettingsSelectSchema,
  testSettingsUpdateSchema,
} from '../validation/test-settings-schemas';

// Enum-like objects for drizzle schema
export const DirectionSettingEnum = [
  'sourceToTarget',
  'targetToSource',
  'random',
] as const;
export const AnswerModeSettingEnum = [
  'typed',
  'multipleChoice',
  'random',
] as const;

// General objects from zod schemas
export type TestSettings = z.infer<typeof testSettingsSelectSchema>;
export type UpdateTestSettings = z.infer<typeof testSettingsUpdateSchema>;
export type TestSettingsInput = Omit<TestSettings, 'id' | 'userId'>;

// Types for test flow
export type Direction = Exclude<TestSettings['direction'], 'random'>;
export type AnswerMode = Exclude<TestSettings['answerMode'], 'random'>;

// Type to be returned by server action when creating question
export type Question =
  | {
      vocabId: number;
      question: string;
      direction: Direction;
      answerMode: 'typed';
    }
  | {
      vocabId: number;
      question: string;
      direction: Direction;
      answerMode: 'multipleChoice';
      answers: string[];
    };

// Type to be sent from client to server on answer submission
export type Answer = {
  vocabId: number;
  direction: Direction;
  answerString: string;
};

// Type to be returned by server action when evaluating answer
export type AnswerResult =
  | {
      correct: true;
    }
  | {
      correct: false;
      correctAnswer: string;
    };

// Type for managing which screen to show in the TestPage
export type TestPhase = 'settings' | 'test';

// State and Action types for TestManager's reducer
export type TestState = {
  inProgress: boolean;
  question: Question;
  currentAnswer: string;
  result: AnswerResult | null;
  currentQuestion: number;
  score: number;
  error: string | null;
};

export type TestAction =
  | { type: 'SET_ANSWER'; payload: string }
  | { type: 'SUBMIT_ANSWER'; payload: AnswerResult }
  | { type: 'LOAD_NEXT_QUESTION'; payload: Question }
  | { type: 'END_TEST' }
  | { type: 'RESET_TEST'; payload: TestState }
  | { type: 'SET_ERROR'; payload: string | null };
