'use client';

import { deleteVocabItem } from '@/lib/actions/vocab';
import { VocabItem } from '@/lib/types/vocab';
import { toast } from 'react-hot-toast';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

export function DeleteVocabAlertContent({
  vocabItem,
}: {
  vocabItem: VocabItem;
}) {
  const handleDelete = async () => {
    const deleteResult = await deleteVocabItem(vocabItem.id);
    if (deleteResult.success) {
      toast.success(`'${vocabItem.source}' deleted!`);
    } else {
      toast.error('Word could not be deleted, please try again.');
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this word?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>
          Delete word
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
