'use client';

import { deleteVocabAction } from '@/lib/actions/vocab';
import { VocabItem } from '@/lib/types/vocab';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-hot-toast';
import { SortableColumnHeader } from '../ui/sortable-column-header';
import { ActionsMenu } from './actions-menu';

// TO DO - update column names using languagePair context/url
const source = 'Swedish';
const target = 'English';

// TO DO - update type with zod schema
export const columns: ColumnDef<VocabItem>[] = [
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header={source} />
    ),
    size: 150,
    minSize: 120,
  },
  {
    accessorKey: 'target',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header={target} />
    ),
    size: 150,
    minSize: 120,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const vocabItem = row.original;

      const handleDelete = async () => {
        const deleteResult = await deleteVocabAction(vocabItem.id);
        if (deleteResult.success) {
          toast.success(`'${vocabItem.source}' deleted!`);
        } else {
          toast.error('Word could not be deleted, please try again.');
        }
      };

      return <ActionsMenu deleteFn={handleDelete} updateHref={'/'} />;
    },
    size: 40,
    maxSize: 50,
    enableGlobalFilter: false,
  },
];
