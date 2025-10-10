import { DataTable } from '@/components/ui/data-table';
import { AddVocabDialog, columns } from '@/components/vocab';
import { getCurrentProfile } from '@/lib/services/auth';
import { getVocab } from '@/lib/services/vocab';

export default async function VocabPage() {
  // Authenticate user profile
  const profileCheck = await getCurrentProfile();
  if (!profileCheck.success) {
    // TO DO - redirect to login
    return;
  }

  // Get vocab for given user profile
  const result = await getVocab(profileCheck.data);
  if (!result.success) {
    // TO DO - handle error (log out? Account page?)
    return;
  }
  const vocab = result.data;

  return (
    <main className="content-grid grid-rows-[auto_1fr] space-y-6 justify-items-center items-start">
      <h1 className="text-center text-2xl font-semibold">Vocabulary</h1>
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={vocab}
          filterPlaceholder="Find a word..."
        />
        <AddVocabDialog className="w-full" />
      </div>
    </main>
  );
}
