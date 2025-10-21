'use client';

import { LanguagePair } from '@/lib/types/language-pair';
import { use } from 'react';
import { DataTable } from '../ui/data-table';
import { languagesColumns } from './languages-columns';

interface LanguagesTableProps {
  dataPromise: Promise<LanguagePair[]>;
}

export function LanguagesTable({ dataPromise }: LanguagesTableProps) {
  const columns = languagesColumns;
  const data = use(dataPromise);

  return <DataTable columns={columns} data={data} filter={false} />;
}
