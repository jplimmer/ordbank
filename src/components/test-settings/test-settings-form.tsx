'use client';

import { saveSettings } from '@/lib/actions/test-settings';
import { ROUTES } from '@/lib/constants/routes';
import { getLogger } from '@/lib/logger';
import { TestSettings, UpdateTestSettings } from '@/lib/types/test';
import { handleValidationError } from '@/lib/utils';
import { testSettingsUpdateSchema } from '@/lib/validation/test-settings-schemas';
import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { FauxDialog } from '../ui/faux-dialog';
import { FieldError } from '../ui/field';
import { AnswerModeFieldSet } from './answer-mode-field-set';
import { DirectionFieldSet } from './direction-field-set';
import { QuestionLimitFieldSet } from './question-limit-field-set';
import { TimeLimitFieldSet } from './time-limit-field-set';

const logger = getLogger();

interface TestSettingsFormProps {
  initialSettings: TestSettings;
  onSubmit: (settings: UpdateTestSettings) => void;
  isLoading: boolean;
}

export function TestSettingsForm({
  initialSettings,
  onSubmit,
  isLoading,
}: TestSettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent page reload
    e.preventDefault();

    // Extract raw form data before starting transition
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const settings = {
        direction: formData.get('direction'),
        answerMode: formData.get('answerMode'),
        questionLimit: formData.get('questionLimit')
          ? Number(formData.get('questionLimit'))
          : null,
        timeLimitMins: formData.get('timeLimitMins')
          ? Number(formData.get('timeLimitMins'))
          : null,
      };

      // Parse form settings client-side for passing to onSubmit
      const parseResult = testSettingsUpdateSchema.safeParse(settings);
      if (!parseResult.success) {
        const validationError = handleValidationError(
          parseResult.error,
          'Update test settings input'
        );

        const fieldErrors = Object.entries(validationError.fieldErrors).map(
          (item) => `${item[0]} (${item[1]})`
        );

        setError(
          fieldErrors.length > 0
            ? `Please correct errors in the following fields:\n\n${fieldErrors.join('\n ')}`
            : 'There was a problem submitting your settings, please referesh the page and try again'
        );
        return;
      }

      // Save settings to database
      const saveResult = await saveSettings(
        initialSettings.id,
        parseResult.data
      );
      if (!saveResult.success) {
        logger.error('Failed to save settings:', error);
        toast('Settings only saved temporarily', { icon: '⚙️' });
      }

      onSubmit(parseResult.data);
    });
  };

  return (
    <FauxDialog closeHref={ROUTES.HOME}>
      <h1 className="text-center text-2xl font-semibold">Test settings</h1>
      <form onSubmit={handleSubmit} className="grid space-y-8">
        <DirectionFieldSet initialDirection={initialSettings.direction} />
        <AnswerModeFieldSet initialAnswerMode={initialSettings.answerMode} />
        <QuestionLimitFieldSet initialLimit={initialSettings.questionLimit} />
        <TimeLimitFieldSet initialLimit={initialSettings.timeLimitMins} />
        <FieldError className="whitespace-pre-line">{error}</FieldError>
        <Button
          type="submit"
          className="text-lg py-5"
          disabled={isLoading || isPending}
        >
          Start test
        </Button>
      </form>
    </FauxDialog>
  );
}
