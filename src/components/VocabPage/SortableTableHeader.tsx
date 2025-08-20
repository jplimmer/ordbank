import { ChevronDown, ChevronUp } from 'lucide-react';
import { SortDirection, VocabTableKeys } from './types';

interface SortableTableHeaderProps {
  field: VocabTableKeys;
  label: string;
  sortField: VocabTableKeys | null;
  sortDirection: SortDirection;
  onSort: (field: VocabTableKeys) => void;
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
