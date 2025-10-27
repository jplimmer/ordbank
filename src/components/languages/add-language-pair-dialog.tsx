'use client';

import { Button, ButtonVariants } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { LanguagePairForm } from './language-pair-form';

interface AddLanguagePairDialogProps {
  variant?: ButtonVariants['variant'];
  className?: string;
}

export function AddLanguagePairDialog({
  variant,
  className,
}: AddLanguagePairDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={variant} size="lg" className={`${className}`}>
          Create language pair
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className="py-2">Create new language pair</DialogTitle>
        </DialogHeader>
        <LanguagePairForm mode="create" />
      </DialogContent>
    </Dialog>
  );
}
