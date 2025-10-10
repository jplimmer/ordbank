'use client';

import { Button, ButtonVariants } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { VocabForm } from './vocab-form';

export function AddVocabDialog({
  variant = 'outline',
  className,
}: {
  variant?: ButtonVariants['variant'];
  className?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} className={`${className}`}>
          Add word
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="py-2">Add new word</DialogTitle>
        </DialogHeader>
        <VocabForm mode="create" />
      </DialogContent>
    </Dialog>
  );
}
