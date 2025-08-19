'use client';

import { useRouter } from 'next/navigation';

interface ModalProps {
  children: React.ReactNode;
  backdropClassName?: string;
  dialogClassName?: string;
}

export function Modal({
  children,
  backdropClassName,
  dialogClassName,
}: ModalProps) {
  const router = useRouter();

  function closeModal() {
    router.back();
  }

  return (
    <div
      onClick={closeModal}
      className={`fixed inset-0 bg-black/60 flex items-center justify-center ${backdropClassName}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-neutral-50 rounded-lg p-6 overflow-auto ${dialogClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
