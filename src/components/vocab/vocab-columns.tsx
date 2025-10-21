'use client';

import { VocabItem } from '@/lib/types/vocab';
import { ColumnDef } from '@tanstack/react-table';
import { SortableColumnHeader } from '../ui/sortable-column-header';
import { ActionsMenu } from './actions-menu';

export const getVocabColumns = (
  sourceLanguage: string,
  targetLanguage: string
): ColumnDef<VocabItem>[] => [
  {
    accessorKey: 'source',
    header: ({ column }) => (
      <SortableColumnHeader
        column={column}
        header={sourceLanguage}
        className="capitalize"
      />
    ),
    size: 150,
    minSize: 120,
  },
  {
    accessorKey: 'target',
    header: ({ column }) => (
      <SortableColumnHeader
        column={column}
        header={targetLanguage}
        className="capitalize"
      />
    ),
    size: 150,
    minSize: 120,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const vocabItem = row.original;

      return <ActionsMenu vocabItem={vocabItem} />;
    },
    meta: {
      align: 'end',
    },
    size: 80,
    minSize: 80,
    enableGlobalFilter: false,
  },
];
