'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { VocabItem } from '@/lib/types/vocab';
import { use, useMemo } from 'react';
import { DataTable } from '../ui/data-table';
import { getVocabColumns } from './vocab-columns';

interface VocabTableProps {
  dataPromise: Promise<VocabItem[]>;
}

export function VocabTable({ dataPromise }: VocabTableProps) {
  const { sourceLanguage, targetLanguage } =
    useLanguagePairContext().activePair;

  const columns = useMemo(
    () => getVocabColumns(sourceLanguage, targetLanguage),
    [sourceLanguage, targetLanguage]
  );
  const data = use(dataPromise);

  return (
    <DataTable
      columns={columns}
      data={data}
      filterPlaceholder="Find a word..."
    />
  );
}
