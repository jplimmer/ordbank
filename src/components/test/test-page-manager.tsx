'use client';

import { getQuestion } from '@/lib/actions/test';
import { saveSettings } from '@/lib/actions/test-settings';
import { getLogger } from '@/lib/logger';
import { Question, TestPhase, TestSettingsInput } from '@/lib/types/test';
import { useState, useTransition } from 'react';
import { toast } from 'react-hot-toast';
import { TestManager } from './test-manager';
import { TestSettingsForm } from './test-settings-form';

const logger = getLogger();

interface TestPageManagerProps {
  initialSettings: TestSettingsInput;
  initialQuestion: Question;
}

export function TestPageManager({
  initialSettings,
  initialQuestion,
}: TestPageManagerProps) {
  const [testPhase, setTestPhase] = useState<TestPhase>('settings');
  const [activeSettings, setActiveSettings] =
    useState<TestSettingsInput>(initialSettings);
  const [firstQuestion, setFirstQuestion] = useState<Question>(initialQuestion);
  const [isPending, startTransition] = useTransition();

  const handleSettingsSubmit = (settings: TestSettingsInput) => {
    startTransition(async () => {
      try {
        await saveSettings(settings);
      } catch (error) {
        logger.error('Failed to save settings:', error);
        toast('Settings only saved temporarily', { icon: '⚙️' });
      }

      try {
        setActiveSettings(settings);

        const question = await getQuestion(
          activeSettings.direction,
          activeSettings.answerMode
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
        settings={initialSettings}
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
