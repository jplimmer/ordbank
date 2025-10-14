export type Direction = 'sourceToTarget' | 'targetToSource' | 'random';
export type DirectionSetting = Direction | 'random';
export type AnswerMode = 'typed' | 'multipleChoice';
export type AnswerModeSetting = AnswerMode | 'random';

export type TestSettings = {
  direction: Direction;
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

export type Answer = {
  vocabId: number;
  direction: Direction;
  answer: string;
};
