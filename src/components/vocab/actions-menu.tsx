import { MoreHorizontal } from 'lucide-react';

interface ActionsMenuProps {
  deleteFn: () => void;
  updateFn: () => void;
}

export function ActionsMenu({ deleteFn, updateFn }: ActionsMenuProps) {
  return (
    <div>
      <MoreHorizontal className="h-4 w-4" />
    </div>
  );
}
