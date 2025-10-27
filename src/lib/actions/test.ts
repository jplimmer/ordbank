'use server';

import { PERMISSION_ERROR } from '../constants/errors';
import { getCurrentUserOrRedirect } from '../services/auth';
import {
  checkAnswer,
  generateMultipleChoiceAnswers,
  selectVocabItem,
  updateVocabStats,
} from '../services/test';
import { ActionResult, ServiceErrorCode } from '../types/common';
import {
  Answer,
  AnswerMode,
  AnswerResult,
  Direction,
  Question,
  UpdateTestSettings,
} from '../types/test';

const errorMessages: Record<ServiceErrorCode, string> = {
  NOT_FOUND: 'Question could not be created for this language pair',
  UNAUTHORISED: PERMISSION_ERROR,
  VALIDATION_ERROR: 'Question could not be validated',
  DATABASE_ERROR: 'Something went wrong. Please try again.',
};

export const getQuestion = async (
  languagePairId: number,
  direction: UpdateTestSettings['direction'],
  answerMode: UpdateTestSettings['answerMode']
): Promise<ActionResult<Question>> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  // Select vocab item for question
  const result = await selectVocabItem(user.id, languagePairId);
  if (!result.success) {
    return {
      success: false,
      error: errorMessages[result.error.code] || 'An unexpected error occurred',
    };
  }

  const vocabItem = result.data;

  // Determine direction to be used
  const effectiveDirection: Direction =
    direction === 'random'
      ? Math.random() > 0.5
        ? 'sourceToTarget'
        : 'targetToSource'
      : direction;

  // Select question word according to direction
  const question =
    effectiveDirection === 'sourceToTarget'
      ? vocabItem['source']
      : vocabItem['target'];

  // Determine answer mode to be used
  const effectiveMode: AnswerMode =
    answerMode === 'random'
      ? Math.random() > 0.5
        ? 'typed'
        : 'multipleChoice'
      : answerMode;

  // Return question according to effectiveMode
  if (effectiveMode === 'multipleChoice') {
    const answers = await generateMultipleChoiceAnswers(
      vocabItem,
      effectiveDirection
    );

    return {
      success: true,
      data: {
        vocabId: vocabItem.id,
        question: question,
        direction: effectiveDirection,
        answerMode: effectiveMode,
        answers: answers,
      },
    };
  } else {
    return {
      success: true,
      data: {
        vocabId: vocabItem.id,
        question: question,
        direction: effectiveDirection,
        answerMode: effectiveMode,
      },
    };
  }
};

export const processAnswer = async (answer: Answer): Promise<AnswerResult> => {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  const result = await checkAnswer(answer);

  await updateVocabStats(user.id, answer.vocabId, result.correct);

  if (result.correct) {
    return { correct: result.correct };
  } else {
    return { correct: result.correct, correctAnswer: result.correctAnswer };
  }
};
