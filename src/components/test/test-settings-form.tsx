'use client';

import { saveSettings } from '@/lib/actions/test-settings';
import { getLogger } from '@/lib/logger';
import { FormResult } from '@/lib/types/common';
import { TestSettings, TestSettingsInput } from '@/lib/types/test';
import Form from 'next/form';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

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

  const [state, action, isPending] = useActionState(
    saveSettings.bind(null, initialSettings.id),
    initialState
  );

  const handleSubmit = async (formData: FormData) => {
    try {
      // TO DO - handle field errors (stop submission?)
      await action(formData);
    } catch (error) {
      logger.error('Failed to save settings:', error);
      toast('Settings only saved temporarily', { icon: '⚙️' });
    }
    // TO DO - use formData instead of initial settings
    onSubmit(initialSettings);
  };
  return (
    <div>
      <Form action={handleSubmit}>
        <ToggleGroup type="single">
          <ToggleGroupItem value={'direction'}></ToggleGroupItem>
        </ToggleGroup>
        <Button type="submit" disabled={isLoading || isPending}>
          Start test
        </Button>
      </Form>
    </div>
  );
}
