'use client';

import { addWord } from '@/lib/wordListActions';
import { ActionResult } from 'next/dist/server/app-render/types';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { AddWordForm } from './AddWordForm';

export function AddWordHandler() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult, FormData>(
    addWord,
    { success: false }
  );

  useEffect(() => {
    if (state.success) {
      router.back();
    }
  }, [state.success, router]);

  return (
    <AddWordForm state={state} formAction={formAction} isPending={isPending} />
  );
}
