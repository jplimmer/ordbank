'use client';

import { WORD_LIST_UI_COLS, WordListItem } from '@/db/schema';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import EditableTableRow from './EditableTableRow';
import { WordListKeys } from './types';

interface WordListTableProps {
  wordList: WordListItem[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (data: WordListItem) => Promise<void>;
}

const colNames = Object.values(WORD_LIST_UI_COLS);
type SortDirection = 'asc' | 'desc';

export function WordListTable({
  wordList,
  onDelete,
  onEdit,
}: WordListTableProps) {
  const [sortField, setSortField] = useState<WordListKeys | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingId, setEditingId] = useState<number | null>(null);

  const sortedWordList = [...wordList].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField].toLowerCase();
    const bVal = b[sortField].toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (bVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: WordListKeys) => {
    if (!(sortField === field)) {
      setSortField(field);
    }
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = (field: WordListKeys) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <table className="table-fixed text-center w-[90%] m-4 border-collapse ">
      <thead>
        <tr>
          {colNames.map((name) => (
            <th
              key={name}
              className="p-2 border border-neutral-300"
              onClick={() => handleSort(name)}
            >
              <div className="flex items-center justify-center gap-1">
                {name.charAt(0).toUpperCase() + name.slice(1)}
                {getSortIcon(name)}
              </div>
            </th>
          ))}
          <th className="p-2 border border-neutral-300" />
        </tr>
      </thead>
      <tbody className="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-neutral-100 ">
        {sortedWordList.map((item) => (
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
