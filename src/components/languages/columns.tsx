'use client';

import { LanguagePair } from '@/lib/types/language-pair';
import { ColumnDef } from '@tanstack/react-table';
import { SortableColumnHeader } from '../ui/sortable-column-header';
import { ActionsMenu } from './actions-menu';

export type LanguagePairTableEntry = LanguagePair & {
  vocabCount: number;
};

export const columns: ColumnDef<LanguagePairTableEntry>[] = [
  {
    accessorKey: 'sourceLanguage',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header="Source" />
    ),
    cell: ({ getValue }) => {
      const value = String(getValue() ?? '');
      return <span className="capitalize">{value}</span>;
    },
    meta: {
      className: 'hidden sm:table-cell',
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
    meta: {
      className: 'hidden sm:table-cell',
    },
  },
  {
    accessorKey: 'pairName',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header="Pair Name" />
    ),
    meta: {
      className: 'sm:hidden',
    },
    size: 100,
  },
  {
    accessorKey: 'vocabCount',
    header: ({ column }) => (
      <SortableColumnHeader column={column} header="Words" />
    ),
    meta: {
      align: 'end',
    },
    size: 110,
    minSize: 100,
  },
  {
    id: 'actions',
    header: () => <span className="sr-only sm:not-sr-only">Actions</span>,
    cell: ({ row }) => {
      const languagePair = row.original;

      return <ActionsMenu languagePair={languagePair} />;
    },
    meta: {
      align: 'end',
    },
    size: 80,
  },
];
