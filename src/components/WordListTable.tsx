'use client';

import { WORD_LIST_UI_COLS, WordListItem } from '@/db/schema';
import { getLogger } from '@/utils/logger';
import { ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

const logger = getLogger();

interface WordListTableProps {
  wordList: WordListItem[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (data: WordListItem) => Promise<void>;
}

const colNames = Object.values(WORD_LIST_UI_COLS);
type WordListKeys = keyof typeof WORD_LIST_UI_COLS;
type SortDirection = 'asc' | 'desc';
type EditForm = Record<WordListKeys, string>;

export function WordListTable({
  wordList,
  onDelete,
  onEdit,
}: WordListTableProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [sortField, setSortField] = useState<WordListKeys | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    swedish: '',
    english: '',
  });

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

  const handleDelete = async (item: WordListItem) => {
    if (!confirm(`Delete ${item.swedish}?`)) return;

    setLoading(true);
    try {
      await onDelete(item.id);
      logger.info(`Word with id ${item.id} deleted`);
    } catch (error) {
      logger.error('Error deleting word:', error);
      alert('Word could not be deleted - please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (item: WordListItem) => {
    setEditingId(item.id);
    setEditForm({ swedish: item.swedish, english: item.english });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ swedish: '', english: '' });
  };

  const handleEditSave = async (item: WordListItem) => {
    setLoading(true);
    try {
      logger.debug('Updating word with new data:', item);
      onEdit(item);
      setEditingId(null);
      setEditForm({ swedish: '', english: '' });
    } catch (error) {
      logger.error('Error saving word:', error);
      alert('Word could not be saved - please try again');
    } finally {
      setLoading(false);
    }
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
          <tr key={item.id}>
            <td className="border border-neutral-300">
              {editingId === item.id ? (
                <input
                  type="text"
                  value={editForm.swedish}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      swedish: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border rounded"
                />
              ) : (
                item.swedish
              )}
            </td>
            <td className="border border-neutral-300">
              {editingId === item.id ? (
                <input
                  type="text"
                  value={editForm.english}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      english: e.target.value,
                    }))
                  }
                  className="w-full px-2 py-1 border rounded"
                  autoFocus
                />
              ) : (
                item.english
              )}
            </td>
            <td className="border border-neutral-300">
              <div className="flex justify-center gap-4">
                {editingId === item.id ? (
                  <>
                    <button
                      onClick={() =>
                        handleEditSave({ id: item.id, ...editForm })
                      }
                      disabled={loading}
                      className="text-green-600 hover:text-green-800 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleEditCancel()}
                      disabled={loading}
                      className="text-gray-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditStart(item)}
                      disabled={loading}
                      className="hover:text-blue-800 disabled:opacity-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={loading}
                      className="hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
