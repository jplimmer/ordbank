'use client';

import { deleteLanguagePairAction } from '@/lib/actions/language-pairs';
import { LanguagePair } from '@/lib/types/language-pair';
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

export function DeleteLanguageAlertContent({
  languagePair,
}: {
  languagePair: LanguagePair;
}) {
  const handleDelete = async () => {
    const deleteResult = await deleteLanguagePairAction(languagePair.id);
    if (deleteResult.success) {
      toast.success(`'${languagePair.pairName}' deleted!`);
    } else {
      toast.error('Language pair could not be deleted, please try again.');
    }
  };

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this language pair?
        </AlertDialogTitle>
        <AlertDialogDescription>
          All words for this pair will be permanently deleted - this action
          cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete} className="bg-red-800">
          Delete language pair
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}
