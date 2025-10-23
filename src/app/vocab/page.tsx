import { RequireLanguagePair } from '@/components/guards/require-language-pair';
import { Spinner } from '@/components/ui/spinner';
import { AddVocabDialog, VocabTable } from '@/components/vocab';
import { getCurrentProfile } from '@/lib/services/auth';
import { getVocab } from '@/lib/services/vocab';
import { VocabItem } from '@/lib/types/vocab';
import { Suspense } from 'react';

export default function VocabPage() {
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
    <div className="grid grid-rows-[auto_1fr] space-y-6 justify-items-center items-start">
      <h1 className="text-center text-2xl font-semibold">Vocabulary</h1>
      <div className="space-y-4">
        <RequireLanguagePair>
          <Suspense fallback={<Spinner />}>
            <VocabTable dataPromise={getUserVocab()} />
            <AddVocabDialog className="w-full" />
          </Suspense>
        </RequireLanguagePair>
      </div>
    </div>
  );
}
