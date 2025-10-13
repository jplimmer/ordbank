import { Spinner } from '@/components/ui/spinner';
import { AddVocabDialog, VocabTable } from '@/components/vocab';
import { getCurrentProfile } from '@/lib/services/auth';
import { getVocab } from '@/lib/services/vocab';
import { VocabItem } from '@/lib/types/vocab';
import { Suspense } from 'react';

export default async function VocabPage() {
  // Get vocab for given user profile
  const getUserVocab = async (): Promise<VocabItem[]> => {
    // Authenticate user profile
    const profileCheck = await getCurrentProfile();
    if (!profileCheck.success) {
      // TO DO - redirect to login?
      return [];
    }

    const result = await getVocab(profileCheck.data);
    if (!result.success) {
      // TO DO - handle errors
      return [];
    }
    return result.data;
  };

  return (
    <main className="content-grid grid-rows-[auto_1fr] space-y-6 justify-items-center items-start">
      <h1 className="text-center text-2xl font-semibold">Vocabulary</h1>
      <div className="space-y-4">
        <Suspense fallback={<Spinner />}>
          <VocabTable dataPromise={getUserVocab()} />
          <AddVocabDialog className="w-full" />
        </Suspense>
      </div>
    </main>
  );
}
