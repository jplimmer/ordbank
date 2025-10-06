import { VocabTable } from '@/components/VocabPage/VocabTable';
import { ROUTES } from '@/lib/routes';
import {
  deleteVocabItem,
  getVocab,
  updateVocabItem,
} from '@/lib/vocab-actions';
import { House, Plus } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function VocabPage() {
  const result = await getVocab();
  if (!result.data) return;

  const vocab = result.data;

  return (
    <main className="content-grid grid-rows-[auto_1fr] justify-items-center items-start">
      <Suspense fallback={<div>Loading...</div>}>
        <header className="flex relative justify-center items-center w-full py-6">
          <h1 className="flex-1 text-center font-bold">Word List</h1>
          <nav className="flex absolute right-0 gap-2">
            <Link href={ROUTES.ADD_VOCAB} scroll={false}>
              <Plus size={32} />
            </Link>
            <Link href={ROUTES.HOME}>
              <House size={32} />
            </Link>
          </nav>
        </header>
        <VocabTable
          vocab={vocab}
          onDelete={deleteVocabItem}
          onEdit={updateVocabItem}
        />
      </Suspense>
    </main>
  );
}
