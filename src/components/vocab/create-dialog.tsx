'use client';

import { createVocabItem } from '@/lib/actions/vocab';
import { FormResult } from '@/lib/types/common';
import { VocabItem } from '@/lib/types/vocab';
import { useActionState, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button, ButtonVariants } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Form } from './form';

interface CreateDialogProps {
  variant?: ButtonVariants['variant'];
  className?: string;
}

export function CreateDialog({
  variant = 'default',
  className,
}: CreateDialogProps) {
  const [open, setOpen] = useState(false);

  const initialState: FormResult<VocabItem> = {
    success: false,
    error: '',
    formData: new FormData(),
  };

  const clientAction = async (
    prevState: FormResult<VocabItem>,
    formData: FormData
  ) => {
    const result = await createVocabItem(prevState, formData);

    if (result.success) {
      setOpen(false);
      toast.success(`Added '${result.data.source}'`);
    }

    return result;
  };

  const [state, formAction, isPending] = useActionState(
    clientAction,
    initialState
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="lg" className={`${className}`}>
          Add word
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="py-2">Add new word</DialogTitle>
        </DialogHeader>
        <Form state={state} formAction={formAction} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
