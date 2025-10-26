import { AnswerModeSetting, DirectionSetting } from '../types/test';

export const TEST_SETTINGS_DEFAULTS = {
  direction: 'random' as DirectionSetting,
  answerMode: 'random' as AnswerModeSetting,
  questionLimit: 10,
  timeLimitMins: 5,
} as const;
