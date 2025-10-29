'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { NotebookPen } from 'lucide-react';
import { use } from 'react';
import { DataTable } from '../ui/data-table';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';
import { LanguagePairTableEntry, columns } from './columns';

interface TableProps {
  dataPromise: Promise<LanguagePairTableEntry[]>;
}

export function Table({ dataPromise }: TableProps) {
  const activePair = useLanguagePairContext().activePair;
  const data = use(dataPromise);

  return (
    <DataTable
      columns={columns}
      data={data}
      empty={empty}
      filter={false}
      getRowClassName={(languagePair) => {
        const isActive = languagePair.id === activePair?.id;
        return isActive ? 'bg-secondary !border-l-4 border-l-primary' : '';
      }}
    />
  );
}

const empty = (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <NotebookPen />
      </EmptyMedia>
      <EmptyTitle>No language pairs</EmptyTitle>
      <EmptyDescription>
        Create a language pair to get started!
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);
