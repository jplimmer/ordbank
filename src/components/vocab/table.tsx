'use client';

import { useActivePair } from '@/contexts/language-pair';
import { ServiceResult } from '@/lib/types/common';
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
import { getVocabColumns } from './columns';

interface TableProps {
  dataPromise: Promise<ServiceResult<VocabItem[]>>;
}

export function Table({ dataPromise }: TableProps) {
  const { sourceLanguage, targetLanguage } = useActivePair();

  const columns = useMemo(
    () => getVocabColumns(sourceLanguage, targetLanguage),
    [sourceLanguage, targetLanguage]
  );

  let data: VocabItem[] = [];
  const result = use(dataPromise);

  if (result.success) {
    data = result.data;
  } else {
    // Potential to handle different errors here
    data = [];
  }

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
