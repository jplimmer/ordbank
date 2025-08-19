import { WordListTable } from '@/components/WordListPage/WordListTable';
import { ROUTES } from '@/lib/routes';
import { deleteWord, getWordList, updateWord } from '@/lib/wordListActions';
import { House, Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function WordListPage() {
  const wordList = await getWordList();

  return (
    <main className="content-grid grid-rows-[auto_1fr] justify-items-center items-start">
      <Suspense fallback={<div>Loading...</div>}>
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
          wordList={wordList}
          onDelete={deleteWord}
          onEdit={updateWord}
        />
      </Suspense>
    </main>
  );
}
