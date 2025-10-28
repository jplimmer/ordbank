'use client';

import { updateLanguagePair } from '@/lib/actions/language-pairs';
import { FormResult } from '@/lib/types/common';
import { LanguagePair } from '@/lib/types/language-pair';
import { useActionState, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Form } from './form';

interface EditDialogProps {
  children: React.ReactNode;
  languagePair: LanguagePair;
}

const initialState: FormResult<LanguagePair> = {
  success: false,
  error: '',
  formData: new FormData(),
};

export function EditDialog({ children, languagePair }: EditDialogProps) {
  const boundUpdate = updateLanguagePair.bind(null, languagePair.id);
  const clientAction = async (
    prevState: FormResult<LanguagePair>,
    formData: FormData
  ) => {
    const result = await boundUpdate(prevState, formData);

    if (result.success) {
      setOpen(false);
      toast.success(`${languagePair.pairName} updated!`);
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(
    clientAction,
    initialState
  );
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form state={state} formAction={formAction} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
