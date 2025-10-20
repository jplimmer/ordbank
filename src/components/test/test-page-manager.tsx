'use client';

import { getQuestion } from '@/lib/actions/test';
import { getLogger } from '@/lib/logger';
import {
  Question,
  TestPhase,
  TestSettings,
  UpdateTestSettings,
} from '@/lib/types/test';
import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { TestSettingsForm } from '../test-settings/test-settings-form';
import { TestManager } from './test-manager';

const logger = getLogger();

interface TestPageManagerProps {
  initialSettings: TestSettings;
  initialQuestion: Question;
}

export function TestPageManager({
  initialSettings,
  initialQuestion,
}: TestPageManagerProps) {
  const [testPhase, setTestPhase] = useState<TestPhase>('settings');
  const [activeSettings, setActiveSettings] =
    useState<UpdateTestSettings>(initialSettings);
  const [firstQuestion, setFirstQuestion] = useState<Question>(initialQuestion);
  const [isPending, startTransition] = useTransition();

  const handleSettingsSubmit = (settings: UpdateTestSettings) => {
    startTransition(async () => {
      try {
        setActiveSettings(settings);

        const question = await getQuestion(
          settings.direction,
          settings.answerMode
        );
        setFirstQuestion(question);

        setTestPhase('test');
      } catch (error) {
        logger.error('Failed to start test:', error);
        toast.error(
          'Test could not be loaded.\nPlease try refreshing the page'
        );
      }
    });
  };

  if (testPhase === 'settings') {
    return (
      <TestSettingsForm
        initialSettings={initialSettings}
        onSubmit={handleSettingsSubmit}
        isLoading={isPending}
      />
    );
  } else {
    return (
      <TestManager settings={activeSettings} initialQuestion={firstQuestion} />
    );
  }
}
