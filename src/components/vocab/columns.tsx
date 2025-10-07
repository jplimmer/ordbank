'use client';

import { VocabItem } from '@/lib/db/schema';
import { ColumnDef } from '@tanstack/react-table';
import { ActionsMenu } from './actions-menu';

// TO DO - update column names using languagePair context/url

// TO DO - update type with zod schema
export const columns: ColumnDef<VocabItem>[] = [
  {
    accessorKey: 'source',
    header: 'Source',
  },
  {
    accessorKey: 'target',
    header: 'Target',
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
  },
];
