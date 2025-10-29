import { VocabItem } from '@/lib/types/vocab';
import { MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DeleteAlertDialog } from './delete-alert-dialog';
import { EditDialog } from './edit-dialog';

const dropdownMenuItemClass = 'px-6 py-4 cursor-pointer';

export function ActionsMenu({ vocabItem }: { vocabItem: VocabItem }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[8rem]">
          <DropdownMenuItem
            onSelect={() => setShowEditDialog(true)}
            className={dropdownMenuItemClass}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => setShowDeleteDialog(true)}
            className={dropdownMenuItemClass}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditDialog
        key={vocabItem.id + String(showEditDialog)}
        vocabItem={vocabItem}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
      <DeleteAlertDialog
        vocabItem={vocabItem}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      />
    </>
  );
}
