import { Column } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from './button';

interface SortableColumnHeaderProps<T> {
  column: Column<T>;
  header: string | React.ReactNode;
  className?: string;
}

export function SortableColumnHeader<T>({
  column,
  header,
  className,
}: SortableColumnHeaderProps<T>) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      className={`has-[svg]:px-0 ${className}`}
    >
      {header}
      <ArrowUpDown className="h-4 w-4" />
    </Button>
  );
}
