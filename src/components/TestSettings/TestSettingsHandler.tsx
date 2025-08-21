'use client';

import {
  TestSettingsActionResult,
  updateSettings,
} from '@/lib/testSettingsActions';
import { useActionState } from 'react';
import TestSettingsForm from './TestSettingsForm';

export default function TestSettingsHandler() {
  //   const router = useRouter();
  const [state, formAction, isPending] =
    useActionState<TestSettingsActionResult>(updateSettings, {
      success: false,
    });

  return (
    <TestSettingsForm
      state={state}
      formAction={formAction}
      isPending={isPending}
    />
  );
}
