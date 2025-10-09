'use client';

import { VocabItem } from '@/lib/types/vocab';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { VocabForm } from './vocab-form';

export function UpdateVocabDialogContent({
  vocabItem,
}: {
  vocabItem: VocabItem;
}) {
  return (
    <DialogContent aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle>{`Edit '${vocabItem.source}'`}</DialogTitle>
      </DialogHeader>
      <VocabForm
        props={{
          mode: 'edit',
          initialData: vocabItem,
        }}
      ></VocabForm>
    </DialogContent>
  );
}
