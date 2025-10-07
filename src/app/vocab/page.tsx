import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/vocab/columns';
import { getVocab } from '@/lib/actions/vocab-actions';
import { ROUTES } from '@/lib/constants/routes';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default async function VocabPage() {
  // TO DO - get languagePairId from URL/context/cookies
  const langPairId = 1;

  const result = await getVocab(langPairId);
  if (!result.success) return;

  const vocab = result.data;

  return (
    <main className="content-grid grid-rows-[auto_1fr] justify-items-center items-start">
      <header className="flex relative justify-center items-center w-full py-6">
        <h1 className="flex-1 text-center font-bold">Word List</h1>
        <nav className="flex absolute right-0 gap-2">
          <Link href={ROUTES.ADD_VOCAB} scroll={false}>
            <Plus size={32} />
          </Link>
        </nav>
      </header>
      <DataTable
        columns={columns}
        data={vocab}
        filterPlaceholder="Find a word..."
      />
    </main>
  );
}
