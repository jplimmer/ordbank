export type Direction = 'sourceToTarget' | 'targetToSource';
export type DirectionSetting = Direction | 'random';
export type AnswerMode = 'typed' | 'multipleChoice';
export type AnswerModeSetting = AnswerMode | 'random';

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
  answer: string;
};

// Type to be returned by server action when evaluating answer
export type AnswerResult =
  | {
      correct: true;
    }
  | {
      correct: false;
      answer: string;
    };
