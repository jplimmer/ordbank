'use client';

import { VocabItem } from '@/db/schema';
import { getDefaultLanguages } from '@/lib/language-utils';
import { VocabActionResult } from '@/lib/vocabActions';
import { useState } from 'react';
import { EditableTableRow } from './EditableTableRow';
import { SortableTableHeader } from './SortableTableHeader';
import { SortDirection, VocabTableKeys } from './types';

interface VocabTableProps {
  vocab: VocabItem[];
  onDelete: (id: number) => Promise<VocabActionResult>;
  onEdit: (data: VocabItem) => Promise<VocabActionResult>;
}

export function VocabTable({ vocab, onDelete, onEdit }: VocabTableProps) {
  const { source, target } = getDefaultLanguages();

  const [sortField, setSortField] = useState<VocabTableKeys | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingId, setEditingId] = useState<number | null>(null);

  const sortedVocab = [...vocab].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField].toLowerCase();
    const bVal = b[sortField].toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: VocabTableKeys) => {
    if (!(sortField === field)) {
      setSortField(field);
      setSortDirection('asc');
    } else {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    }
  };

  return (
    <table className="table-fixed text-center w-[90%] m-4 border-collapse">
      <thead>
        <tr>
          <SortableTableHeader
            field="source"
            label={source.name}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <SortableTableHeader
            field="target"
            label={target.name}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
          <th className="p-2 border border-neutral-300" />
        </tr>
      </thead>
      <tbody className="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-neutral-100 ">
        {sortedVocab.map((item) => (
          <EditableTableRow
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            onEditStart={setEditingId}
            onEditEnd={() => setEditingId(null)}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}
