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
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add word</DialogTitle>
        </DialogHeader>
        <VocabForm
          props={{
            mode: 'create',
          }}
        ></VocabForm>
      </DialogContent>
    </Dialog>
  );
}
