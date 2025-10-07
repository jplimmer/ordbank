'use client';

import { addVocab } from '@/lib/vocab-actions';
import { ActionResult } from 'next/dist/server/app-render/types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { AddVocabForm } from './AddVocabForm';

export function AddVocabHandler() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(
    addVocab,
    { success: false }
  );

  useEffect(() => {
    if (state.success) {
      router.back();
    }
  }, [state.success, router]);

  return (
    <AddVocabForm state={state} formAction={formAction} isPending={isPending} />
  );
}
