import { VocabItem } from './vocab';

export type Direction = 'sourceToTarget' | 'targetToSource' | 'random';
export type AnswerModeResponse = 'typed' | 'multipleChoice';
export type AnswerModeSetting = AnswerModeResponse | 'random';

export type TestSettings = {
  direction: Direction;
  answerMode: AnswerModeSetting;
  questionLimit: number | null;
  timeLimitMins: number | null;
};

// Type to be returned by service when selecting vocab item for question
export type QuestionVocabItem = Pick<VocabItem, 'id' | 'source' | 'target'>;

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

export type Answer = {
  vocabId: number;
  question: string;
  direction: Direction;
  answer: string;
};
