'use client';

import { VocabItem } from '@/lib/types/vocab';
import { use } from 'react';
import { DataTable } from '../ui/data-table';
import { useVocabColumns } from './vocab-columns';

interface VocabTableProps {
  dataPromise: Promise<VocabItem[]>;
}

export function VocabTable({ dataPromise }: VocabTableProps) {
  const columns = useVocabColumns();
  const data = use(dataPromise);

  return (
    <DataTable
      columns={columns}
      data={data}
      filterPlaceholder="Find a word..."
    />
  );
}
