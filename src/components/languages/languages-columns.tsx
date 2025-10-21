'use client';

import { LanguagePair } from '@/lib/types/language-pair';
import { ColumnDef } from '@tanstack/react-table';
import { SortableColumnHeader } from '../ui/sortable-column-header';
import { ActionsMenu } from './actions-menu';

export type LanguagePairTableEntry = LanguagePair & {
  vocabCount: number;
};

export const languagesColumns: ColumnDef<LanguagePairTableEntry>[] = [
  {
    accessorKey: 'sourceLanguage',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header="Source" />
    ),
    cell: ({ getValue }) => {
      const value = String(getValue() ?? '');
      return <span className="capitalize">{value}</span>;
    },
  },
  {
    accessorKey: 'targetLanguage',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header="Target" />
    ),
    cell: ({ getValue }) => {
      const value = String(getValue() ?? '');
      return <span className="capitalize">{value}</span>;
    },
  },
  {
    accessorKey: 'vocabCount',
    header: 'Word Count',
    meta: {
      align: 'end',
    },
    size: 110,
    minSize: 110,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const languagePair = row.original;

      return <ActionsMenu languagePair={languagePair} />;
    },
    meta: {
      align: 'end',
    },
    size: 80,
    minSize: 80,
  },
];
