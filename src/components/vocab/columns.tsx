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
    cell: () => {
      const handleDelete = () => {
        console.log('Delete function goes here');
      };

      return <ActionsMenu deleteFn={handleDelete} updateHref={'/'} />;
    },
    size: 40,
    maxSize: 50,
    enableGlobalFilter: false,
  },
];
