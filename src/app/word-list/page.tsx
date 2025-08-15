import { wordListTable } from '@/db/schema';
import { getWordList } from '@/lib/actions';
import { ROUTES } from '@/lib/routes';
import { getTableColumns } from 'drizzle-orm';
import { House, Plus } from 'lucide-react';
import Link from 'next/link';

export default async function WordListPage() {
  const wordList = await getWordList();
  const columns = getTableColumns(wordListTable);
  const colNames = Object.keys(columns).filter((key) => key !== 'id');

  return (
    <main className="content-grid grid-rows-[auto_1fr] justify-items-center items-start">
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
      <table className="table-fixed text-center w-[90%] m-4 border-collapse ">
        <thead>
          <tr>
            {colNames.map((name) => (
              <th key={name} className="p-2 border border-neutral-300">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:nth-child(odd)]:bg-white [&>tr:nth-child(even)]:bg-neutral-100 ">
          {wordList.map(({ id, swedish, english }) => (
            <tr key={id}>
              <td className="border border-neutral-300">{swedish}</td>
              <td className="border border-neutral-300">{english}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
