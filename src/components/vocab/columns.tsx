'use client';

import { VocabItem } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
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
  },
  {
    accessorKey: 'target',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header={target} />
    ),
  },
  {
    id: 'actions',
    header: '',
    cell: () => {
      const handleDelete = () => {
        console.log('Delete function goes here');
      };

      return <ActionsMenu deleteFn={handleDelete} updateHref={'/'} />;
    },
    enableGlobalFilter: false,
  },
];
