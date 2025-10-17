'use client';

import { TestSettingsInput } from '@/lib/types/test';
import Form from 'next/form';
import { Button } from '../ui/button';

interface TestSettingsFormProps {
  settings: TestSettingsInput;
  onSubmit: (settings: TestSettingsInput) => void;
  isLoading: boolean;
}

export function TestSettingsForm({
  settings,
  onSubmit,
  isLoading,
}: TestSettingsFormProps) {
  const handleSubmit = async (formData: FormData) => {
    onSubmit(settings);
  };
  return (
    <div>
      <Form action={handleSubmit}>
        <Button type="submit">Start test</Button>
      </Form>
    </div>
  );
}
