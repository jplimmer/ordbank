'use client';

import { LanguagePair } from '@/lib/types/language-pair';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { LanguagePairForm } from './language-pair-form';

export function UpdateLanguageDialogContent({
  languagePair,
}: {
  languagePair: LanguagePair;
}) {
  return (
    <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
      <DialogHeader>
        <DialogTitle className="py-2">{`Edit '${languagePair.pairName}'`}</DialogTitle>
      </DialogHeader>
      <LanguagePairForm mode="edit" initialData={languagePair} />
    </DialogContent>
  );
}
