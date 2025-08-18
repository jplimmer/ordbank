'use client';

import { WordListItem } from '@/db/schema';
import { ROUTES } from '@/lib/routes';
import { deleteWord, updateWord } from '@/lib/wordListActions';
import { House, Plus } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AddWordForm } from '../AddWordForm';
import { ModalWindow } from '../ModalWindow';
import { WordListTable } from './WordListTable';

export default function WordListPageContent({
  initialWordList,
}: {
  initialWordList: WordListItem[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Check for modal parameter on component mount and when searchParams change
  useEffect(() => {
    const shouldOpenModal = searchParams.has('add-word');
    setIsModalOpen(shouldOpenModal);
  }, [searchParams]);

  const handleCloseModal = () => {
    setIsModalOpen(false);

    const params = new URLSearchParams(searchParams);
    params.delete('add-word');
    const newUrl = params.toString() ? `${params.toString()}` : pathname;
    router.replace(newUrl);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    const params = new URLSearchParams(searchParams);

    params.set('add-word', '');
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <header className="flex relative justify-center items-center w-full py-6">
        <h1 className="flex-1 text-center font-bold">Word List</h1>
        <nav className="flex absolute right-0 gap-2">
          <button onClick={handleOpenModal}>
            <Plus size={32} />
          </button>
          <Link href={ROUTES.HOME}>
            <House size={32} />
          </Link>
        </nav>
      </header>
      <WordListTable
        wordList={initialWordList}
        onDelete={deleteWord}
        onEdit={updateWord}
      />
      <ModalWindow isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddWordForm />
      </ModalWindow>
    </>
  );
}
