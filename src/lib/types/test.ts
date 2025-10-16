// Enum-like object for drizzle schema
export const DirectionSettingEnum = [
  'sourceToTarget',
  'targetToSource',
  'random',
] as const;
// Types for test flow
export type DirectionSetting = (typeof DirectionSettingEnum)[number];
export type Direction = Exclude<DirectionSetting, 'random'>;

export const AnswerModeSettingEnum = [
  'typed',
  'multipleChoice',
  'random',
] as const;
export type AnswerModeSetting = (typeof AnswerModeSettingEnum)[number];
export type AnswerMode = Exclude<AnswerModeSetting, 'random'>;

export type TestSettings = {
  direction: DirectionSetting;
  answerMode: AnswerModeSetting;
  questionLimit: number | null;
  timeLimitMins: number | null;
};

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

// State and Action types for TestManager's reducer
export type TestState = {
  inProgress: boolean;
  question: Question;
  currentAnswer: string;
  result: AnswerResult | null;
  questionCount: number;
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
