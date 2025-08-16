'use client';

import { WORD_LIST_UI_COLS, WordListItem } from '@/db/schema';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface WordListTableProps {
  wordList: WordListItem[];
  //   onDelete: (id: number) => Promise<void>;
  //   onEdit: (data: WordListItem) => Promise<void>;
}

const colNames = Object.values(WORD_LIST_UI_COLS);
type SortField = keyof typeof WORD_LIST_UI_COLS;
type SortDirection = 'asc' | 'desc';

export function WordListTable({ wordList }: WordListTableProps) {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const sortedWordList = [...wordList].sort((a, b) => {
    if (!sortField) return 0;

    const aVal = a[sortField].toLowerCase();
    const bVal = b[sortField].toLowerCase();

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (bVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (!(sortField === field)) {
      setSortField(field);
    }
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const getSortIcon = (field: SortField) => {
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
        {sortedWordList.map(({ id, swedish, english }) => (
          <tr key={id}>
            <td className="border border-neutral-300">{swedish}</td>
            <td className="border border-neutral-300">{english}</td>
            <td className="border border-neutral-300">
              <div className="flex justify-center gap-4">
                <button>
                  <Edit size={16} />
                </button>
                <button>
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
