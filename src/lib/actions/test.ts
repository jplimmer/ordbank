'use server';

import { notFound } from 'next/navigation';
import { getCurrentProfile } from '../services/auth';
import {
  checkAnswer,
  generateMultipleChoiceAnswers,
  selectVocabItem,
  updateVocabStats,
} from '../services/test';
import {
  Answer,
  AnswerMode,
  AnswerResult,
  Direction,
  Question,
  TestSettings,
} from '../types/test';

export const getQuestion = async (
  direction: TestSettings['direction'],
  answerMode: TestSettings['answerMode']
): Promise<Question> => {
  const profileCheck = await getCurrentProfile();
  // TO DO - handle profile error
  if (!profileCheck.success) return notFound();

  // Select vocab item for question
  const vocabItem = await selectVocabItem(profileCheck.data);

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

export const processAnswer = async (answer: Answer): Promise<AnswerResult> => {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  // TO DO - handle profile error
  if (!profileCheck.success) return notFound();

  const result = await checkAnswer(answer);

  await updateVocabStats(profileCheck.data, answer.vocabId, result.correct);

  if (result.correct) {
    return { correct: result.correct };
  } else {
    return { correct: result.correct, correctAnswer: result.correctAnswer };
  }
};
