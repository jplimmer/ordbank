'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { use } from 'react';
import { DataTable } from '../ui/data-table';
import { LanguagePairTableEntry, languagesColumns } from './languages-columns';

interface LanguagesTableProps {
  dataPromise: Promise<LanguagePairTableEntry[]>;
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
        return isActive
          ? 'bg-indigo-100 border-l-4 border-l-indigo-300 dark:bg-indigo-900'
          : '';
      }}
      filter={false}
    />
  );
}
