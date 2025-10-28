'use client';

import { updateLanguagePair } from '@/lib/actions/language-pairs';
import { FormResult } from '@/lib/types/common';
import { LanguagePair } from '@/lib/types/language-pair';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Form } from './form';

interface EditDialogProps {
  languagePair: LanguagePair;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDialog({
  languagePair,
  open,
  onOpenChange,
}: EditDialogProps) {
  const createInitialFormData = (languagePair: LanguagePair): FormData => {
    const formData = new FormData();
    formData.set('source-language', languagePair.sourceLanguage);
    formData.set('target-language', languagePair.targetLanguage);

    return formData;
  };

  const initialState: FormResult<LanguagePair> = {
    success: false,
    error: '',
    formData: createInitialFormData(languagePair),
  };

  const boundUpdate = updateLanguagePair.bind(null, languagePair.id);
  const clientAction = async (
    prevState: FormResult<LanguagePair>,
    formData: FormData
  ) => {
    const result = await boundUpdate(prevState, formData);

    if (result.success) {
      onOpenChange(false);
      toast.success(`${result.data.pairName} updated!`);
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(
    clientAction,
    initialState
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogTitle className="py-2">{`Edit '${languagePair.pairName}'`}</DialogTitle>
        <Form state={state} formAction={formAction} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
