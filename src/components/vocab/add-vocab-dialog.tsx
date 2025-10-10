'use client';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { VocabForm } from './vocab-form';

export function AddVocabDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-green-700 text-white hover:bg-green-700/30"
        >
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
