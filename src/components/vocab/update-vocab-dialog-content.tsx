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
    <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="py-2">{`Edit '${vocabItem.source}'`}</DialogTitle>
      </DialogHeader>
      <VocabForm mode="edit" initialData={vocabItem} />
    </DialogContent>
  );
}
