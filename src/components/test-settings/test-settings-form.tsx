'use client';

import { ROUTES } from '@/lib/constants/routes';
import { getLogger } from '@/lib/logger';
import { FormResult } from '@/lib/types/common';
import { TestSettings, TestSettingsInput } from '@/lib/types/test';
import { Button } from '../ui/button';
import { FauxDialog } from '../ui/faux-dialog';
import { AnswerModeFieldSet } from './answer-mode-field-set';
import { DirectionFieldSet } from './direction-field-set';
import { QuestionLimitFieldSet } from './question-limit-field-set';
import { TimeLimitFieldSet } from './time-limit-field-set';

const logger = getLogger();

interface TestSettingsFormProps {
  initialSettings: TestSettings;
  onSubmit: (settings: TestSettingsInput) => void;
  isLoading: boolean;
}

export function TestSettingsForm({
  initialSettings,
  onSubmit,
  isLoading,
}: TestSettingsFormProps) {
  const initialState: FormResult<null> = {
    success: false,
    error: '',
    formData: new FormData(),
  };

  // const [state, action, isPending] = useActionState(
  //   saveSettings.bind(null, initialSettings.id),
  //   initialState
  // );

  const handleSubmit = async (formData: FormData) => {
    // try {
    //   // TO DO - handle field errors (stop submission?)
    //   await action(formData);
    // } catch (error) {
    //   logger.error('Failed to save settings:', error);
    //   toast('Settings only saved temporarily', { icon: '⚙️' });
    // }
    // // TO DO - use formData instead of initial settings
    // onSubmit(initialSettings);
  };

  return (
    <FauxDialog closeHref={ROUTES.HOME}>
      <h1 className="text-center text-2xl font-semibold">Test settings</h1>
      <form action={handleSubmit} className="grid space-y-8">
        <DirectionFieldSet initialDirection={initialSettings.direction} />
        <AnswerModeFieldSet initialAnswerMode={initialSettings.answerMode} />
        <QuestionLimitFieldSet initialLimit={initialSettings.questionLimit} />
        <TimeLimitFieldSet initialLimit={initialSettings.timeLimitMins} />
        <Button type="submit" className="text-lg py-5" disabled={isLoading}>
          {/* <Button type="submit" className="text-lg py-5" disabled={isLoading || isPending}> */}
          Start test
        </Button>
      </form>
    </FauxDialog>
  );
}
