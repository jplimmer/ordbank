import { VocabItem } from '@/db/schema';
import { VocabActionResult } from '@/lib/vocabActions';
import { getLogger } from '@/utils/logger';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { EditForm } from './types';

const logger = getLogger();

interface EditableTableRowProps {
  item: VocabItem;
  isEditing: boolean;
  onEditStart: (id: number) => void;
  onEditEnd: () => void;
  onEdit: (data: VocabItem) => Promise<VocabActionResult>;
  onDelete: (id: number) => Promise<VocabActionResult>;
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
    source: item.source,
    target: item.target,
  });

  const handleEditStart = () => {
    setEditForm({
      source: item.source,
      target: item.target,
    });
    onEditStart(item.id);
  };

  const handleEditCancel = () => {
    setEditForm({
      source: item.source,
      target: item.target,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      e.preventDefault();
      handleEditSave();
    } else if (e.key === 'Escape' && !loading) {
      e.preventDefault();
      handleEditCancel();
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete ${item.source}?`)) return;

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
            value={editForm.source}
            onChange={(e) => handleFormChange('source', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border rounded"
          />
        ) : (
          item.source
        )}
      </td>
      <td className="border border-neutral-300">
        {isEditing ? (
          <input
            type="text"
            value={editForm.target}
            onChange={(e) => handleFormChange('target', e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 border rounded"
            autoFocus
          />
        ) : (
          item.target
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
