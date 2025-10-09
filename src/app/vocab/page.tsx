import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/vocab/columns';
import { ROUTES } from '@/lib/constants/routes';
import { getCurrentProfile } from '@/lib/services/auth';
import { getVocab } from '@/lib/services/vocab';
import Link from 'next/link';

export default async function VocabPage() {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    // TO DO - redirect to login
    return;
  }

  const result = await getVocab(profileCheck.data);
  if (!result.success) {
    // TO DO - handle error
    return;
  }

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
