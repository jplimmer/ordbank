import { VocabItem } from '@/lib/types/vocab';
import { MoreHorizontal } from 'lucide-react';
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DeleteVocabAlertContent } from './delete-vocab-alert-content';
import { UpdateVocabDialogContent } from './update-vocab-dialog-content';

export function ActionsMenu({ vocabItem }: { vocabItem: VocabItem }) {
  return (
    <AlertDialog>
      <Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[5.5rem]">
            <DialogTrigger asChild>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </DialogTrigger>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                variant="destructive"
                onSelect={(e) => e.preventDefault()}
              >
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
        <UpdateVocabDialogContent vocabItem={vocabItem} />
        <DeleteVocabAlertContent vocabItem={vocabItem} />
      </Dialog>
    </AlertDialog>
  );
}
