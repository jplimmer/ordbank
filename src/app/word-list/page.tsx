import WordListPageContent from '@/components/WordListPage/WordListPageContent';
import { getWordList } from '@/lib/wordListActions';

export default async function WordListPage() {
  const wordList = await getWordList();

  return (
    <main className="content-grid grid-rows-[auto_1fr] justify-items-center items-start">
      <WordListPageContent initialWordList={wordList} />
    </main>
  );
}
