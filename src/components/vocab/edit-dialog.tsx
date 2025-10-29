'use client';

import { updateVocabItem } from '@/lib/actions/vocab';
import { FormResult } from '@/lib/types/common';
import { VocabItem } from '@/lib/types/vocab';
import { useActionState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Form } from './form';

interface EditDialogProps {
  vocabItem: VocabItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDialog({ vocabItem, open, onOpenChange }: EditDialogProps) {
  const createInitialFormData = (vocabItem: VocabItem): FormData => {
    const formData = new FormData();
    formData.set('source', vocabItem.source);
    formData.set('target', vocabItem.target);

    return formData;
  };

  const initialState: FormResult<VocabItem> = {
    success: false,
    error: '',
    formData: createInitialFormData(vocabItem),
  };

  const boundUpdate = updateVocabItem.bind(null, vocabItem.id);
  const clientAction = async (
    prevState: FormResult<VocabItem>,
    formData: FormData
  ) => {
    const result = await boundUpdate(prevState, formData);

    if (result.success) {
      onOpenChange(false);
      toast.success(`'${result.data.source}' updated`);
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
        <DialogTitle className="py-2">{`Edit '${vocabItem.source}'`}</DialogTitle>
        <Form state={state} formAction={formAction} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
