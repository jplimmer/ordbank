'use client';

import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface ModalProps {
  children: React.ReactNode;
  title: string;
  showTitle: boolean;
}

export function Modal({ children, title, showTitle }: ModalProps) {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onOpenChange={(open: boolean) => !open && router.back()}
    >
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle className={showTitle ? '' : 'sr-only'}>
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
