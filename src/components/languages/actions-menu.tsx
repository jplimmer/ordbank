'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { LanguagePair } from '@/lib/types/language-pair';
import { MoreHorizontal } from 'lucide-react';
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

export function ActionsMenu({ languagePair }: { languagePair: LanguagePair }) {
  const { activePair, setActive } = useLanguagePairContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[9rem]">
        <DropdownMenuItem
          onSelect={() => setActive(languagePair)}
          disabled={languagePair.id === activePair?.id}
          className={dropdownMenuItemClass}
        >
          Set active
        </DropdownMenuItem>
        <EditDialog languagePair={languagePair}>
          <DropdownMenuItem className={dropdownMenuItemClass}>
            Edit
          </DropdownMenuItem>
        </EditDialog>
        <DeleteAlertDialog languagePair={languagePair}>
          <DropdownMenuItem
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
            className={dropdownMenuItemClass}
          >
            Delete
          </DropdownMenuItem>
        </DeleteAlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
