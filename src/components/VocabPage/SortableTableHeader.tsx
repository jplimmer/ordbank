import { ChevronDown, ChevronUp } from 'lucide-react';
import { SortDirection, VocabKeys } from './types';

interface SortableTableHeaderProps {
  field: VocabKeys;
  label: string;
  sortField: VocabKeys | null;
  sortDirection: SortDirection;
  onSort: (field: VocabKeys) => void;
}

export function SortableTableHeader({
  field,
  label,
  sortField,
  sortDirection,
  onSort,
}: SortableTableHeaderProps) {
  const isActive = sortField === field;

  return (
    <th className="p-2 border border-neutral-300" onClick={() => onSort(field)}>
      <div className="flex items-center justify-center gap-1">
        {label}
        {isActive &&
          (sortDirection === 'asc' ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          ))}
      </div>
    </th>
  );
}
