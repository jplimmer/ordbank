import WordListPageContent from '@/components/WordListPage/WordListPageContent';
import { getWordList } from '@/lib/wordListActions';
import { Suspense } from 'react';

export default async function WordListPage() {
  const wordList = await getWordList();

  return (
    <main className="content-grid grid-rows-[auto_1fr] justify-items-center items-start">
      <Suspense fallback={<div>Loading...</div>}>
        <WordListPageContent initialWordList={wordList} />
      </Suspense>
    </main>
  );
}
