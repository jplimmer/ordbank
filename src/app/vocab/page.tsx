import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/vocab/columns';
import { ROUTES } from '@/lib/constants/routes';
import { getVocab } from '@/lib/services/vocab';
import Link from 'next/link';

export default async function VocabPage() {
  // TO DO - authenticate user
  const userId = 1;

  // TO DO - get languagePairId from URL/context/cookies
  const langPairId = 1;

  const result = await getVocab(userId, langPairId);
  if (!result.success) return;

  const vocab = result.data;

  return (
    <main className="content-grid grid-rows-[auto_1fr] space-y-8 justify-items-center items-start">
      <h1 className="text-center text-4xl font-semibold mt-8">Vocabulary</h1>
      <div className="space-y-8">
        <DataTable
          columns={columns}
          data={vocab}
          filterPlaceholder="Find a word..."
        />
        <Button
          asChild
          variant="outline"
          className="w-full bg-green-700 text-white hover:bg-green-700/30"
        >
          <Link href={ROUTES.ADD_VOCAB} scroll={false}>
            Add word
          </Link>
        </Button>
      </div>
    </main>
  );
}
