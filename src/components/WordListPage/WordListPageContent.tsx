'use client';

import { WordListItem } from '@/db/schema';
import { ROUTES } from '@/lib/routes';
import { deleteWord, updateWord } from '@/lib/wordListActions';
import { House, Plus } from 'lucide-react';
import Link from 'next/link';
import { WordListTable } from './WordListTable';

export default function WordListPageContent({
  initialWordList,
}: {
  initialWordList: WordListItem[];
}) {
  //   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <header className="flex relative justify-center items-center w-full py-6">
        <h1 className="flex-1 text-center font-bold">Word List</h1>
        <nav className="flex absolute right-0 gap-2">
          <Link href={ROUTES.ADD_WORD}>
            <Plus size={32} />
          </Link>
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
    </>
  );
}
