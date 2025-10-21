'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { LanguagePair } from '@/lib/types/language-pair';
import { use } from 'react';
import { DataTable } from '../ui/data-table';
import { languagesColumns } from './languages-columns';

interface LanguagesTableProps {
  dataPromise: Promise<LanguagePair[]>;
}

export function LanguagesTable({ dataPromise }: LanguagesTableProps) {
  const activePair = useLanguagePairContext().activePair;
  const data = use(dataPromise);

  return (
    <DataTable
      columns={languagesColumns}
      data={data}
      getRowClassName={(languagePair) => {
        const isActive = languagePair.id === activePair.id;
        return isActive ? 'bg-blue-50 border-l-4 border-l-blue-300' : '';
      }}
      filter={false}
    />
  );
}
