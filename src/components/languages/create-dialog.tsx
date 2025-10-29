'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { createLanguagePair } from '@/lib/actions/language-pairs';
import { FormResult } from '@/lib/types/common';
import { LanguagePair } from '@/lib/types/language-pair';
import { useActionState, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button, ButtonVariants } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Form } from './form';

interface CreateDialogProps {
  variant?: ButtonVariants['variant'];
  className?: string;
}

export function CreateDialog({ variant, className }: CreateDialogProps) {
  const { setActive } = useLanguagePairContext();
  const [open, setOpen] = useState(false);

  const initialState: FormResult<LanguagePair> = {
    success: false,
    error: '',
    formData: new FormData(),
  };

  const clientAction = async (
    prevState: FormResult<LanguagePair>,
    formData: FormData
  ) => {
    const result = await createLanguagePair(prevState, formData);

    if (result.success) {
      setActive(result.data);
      setOpen(false);
      toast.success(`Created ${result.data.pairName}`);
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
          Create language pair
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogTitle className="py-2">Create new language pair</DialogTitle>
        <Form state={state} formAction={formAction} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
