'use server';

import { notFound } from 'next/navigation';
import { getCurrentProfile } from '../services/auth';
import {
  generateMultipleChoiceAnswers,
  selectVocabItem,
} from '../services/test';
import {
  AnswerMode,
  AnswerModeSetting,
  Direction,
  Question,
} from '../types/test';

export const getQuestion = async (
  direction: Direction,
  answerMode: AnswerModeSetting
): Promise<Question> => {
  const userProfile = await getCurrentProfile();
  // TO DO - handle profile error
  if (!userProfile.success) return notFound();

  // Select vocab item for question
  const vocabItem = await selectVocabItem(userProfile.data);

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
    return {
      vocabId: vocabItem.id,
      question: question,
      direction: effectiveDirection,
      answerMode: effectiveMode,
      answers: await generateMultipleChoiceAnswers(
        vocabItem,
        effectiveDirection
      ),
    };
  } else {
    return {
      vocabId: vocabItem.id,
      question: question,
      direction: effectiveDirection,
      answerMode: effectiveMode,
    };
  }
};
