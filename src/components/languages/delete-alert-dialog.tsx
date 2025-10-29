'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { deleteLanguagePair } from '@/lib/actions/language-pairs';
import { LanguagePair } from '@/lib/types/language-pair';
import { toast } from 'react-hot-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface DeleteAlertDialogProps {
  languagePair: LanguagePair;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAlertDialog({
  languagePair,
  open,
  onOpenChange,
}: DeleteAlertDialogProps) {
  const { activePair, setActive } = useLanguagePairContext();

  const handleDelete = async () => {
    const deleteResult = await deleteLanguagePair(languagePair.id);
    if (deleteResult.success) {
      if (deleteResult.data.id === activePair?.id) {
        setActive(null);
      }
      toast.success(`'${languagePair.pairName}' deleted`);
    } else {
      toast.error('Language pair could not be deleted, please try again.');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
          <AlertDialogAction onClick={handleDelete}>
            Delete language pair
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
