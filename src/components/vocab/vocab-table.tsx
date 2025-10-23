'use client';

import { useActivePair } from '@/contexts/language-pair';
import { VocabItem } from '@/lib/types/vocab';
import { NotebookPen } from 'lucide-react';
import { use, useMemo } from 'react';
import { DataTable } from '../ui/data-table';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty';
import { getVocabColumns } from './vocab-columns';

interface VocabTableProps {
  dataPromise: Promise<VocabItem[]>;
}

export function VocabTable({ dataPromise }: VocabTableProps) {
  const { sourceLanguage, targetLanguage } = useActivePair();

  const columns = useMemo(
    () => getVocabColumns(sourceLanguage, targetLanguage),
    [sourceLanguage, targetLanguage]
  );
  const data = use(dataPromise);

  return (
    <DataTable
      columns={columns}
      data={data}
      empty={empty}
      filterPlaceholder="Find a word..."
    />
  );
}

const empty = (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <NotebookPen />
      </EmptyMedia>
      <EmptyTitle>No vocabulary</EmptyTitle>
      <EmptyDescription>Add a word to get started!</EmptyDescription>
    </EmptyHeader>
  </Empty>
);
