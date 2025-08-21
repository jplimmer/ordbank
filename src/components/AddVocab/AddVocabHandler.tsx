'use client';

import { addVocab, VocabActionResult } from '@/lib/vocabActions';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { AddVocabForm } from './AddVocabForm';

export function AddVocabHandler() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<
    VocabActionResult,
    FormData
  >(addVocab, { success: false });

  useEffect(() => {
    if (state.success) {
      router.back();
    }
  }, [state.success, router]);

  return (
    <AddVocabForm state={state} formAction={formAction} isPending={isPending} />
  );
}
