import { WordListItem } from '@/db/schema';
import { getLogger } from '@/utils/logger';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EditForm } from './types';

const logger = getLogger();

interface EditableTableRowProps {
  item: WordListItem;
  isEditing: boolean;
  onEditStart: (id: number) => void;
  onEditEnd: () => void;
  onEdit: (data: WordListItem) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function EditableTableRow({
  item,
  isEditing,
  onEditStart,
  onEditEnd,
  onEdit,
  onDelete,
}: EditableTableRowProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<EditForm>({
    swedish: item.swedish,
    english: item.english,
  });

  const handleEditStart = () => {
    setEditForm({
      swedish: item.swedish,
      english: item.english,
    });
    onEditStart(item.id);
  };

  const handleEditCancel = () => {
    setEditForm({
      swedish: item.swedish,
      english: item.english,
    });
    onEditEnd();
  };

  const handleEditSave = async () => {
    setLoading(true);
    try {
      logger.debug(`Updating id ${item.id} with new data:`, editForm);
      await onEdit({ id: item.id, ...editForm });
      onEditEnd();
    } catch (error) {
      logger.error('Error saving word:', error);
      alert('Word could not be saved - please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
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

  const handleFormChange = (field: keyof EditForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <tr>
      <td className="border border-neutral-300">
        {isEditing ? (
          <input
            type="text"
            value={editForm.swedish}
            onChange={(e) => handleFormChange('swedish', e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          item.swedish
        )}
      </td>
      <td className="border border-neutral-300">
        {isEditing ? (
          <input
            type="text"
            value={editForm.english}
            onChange={(e) => handleFormChange('english', e.target.value)}
            className="w-full px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          item.english
        )}
      </td>
      <td className="border border-neutral-300">
        <div className="flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleEditSave}
                disabled={loading}
                className="text-green-600 hover:text-green-800 disabled:opacity-50"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                disabled={loading}
                className="text-gray-600 hover:text-red-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditStart}
                disabled={loading}
                className="hover:text-blue-800 disabled:opacity-50"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={handleDelete}
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
  );
}
