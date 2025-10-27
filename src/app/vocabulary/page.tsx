import { NoLanguagePairFallback } from '@/components/fallbacks/no-language-pair-fallback';
import { RequireActivePairContext } from '@/components/guards/require-active-pair-context';
import { Spinner } from '@/components/ui/spinner';
import { AddVocabDialog, VocabTable } from '@/components/vocab';
import { getCurrentUserOrRedirect } from '@/lib/services/auth';
import { getVocab } from '@/lib/services/vocab';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'My Vocabulary',
  description: 'Manage your vocabulary list',
};

export default async function VocabPage() {
  // Authenticate user profile
  const user = await getCurrentUserOrRedirect();

  if (!user.activeLanguagePairId) {
    return (
      <div className="grid grid-rows-[auto_1fr] space-y-6 justify-items-center items-start">
        <h1 className="text-center text-2xl font-semibold">Vocabulary</h1>
        <NoLanguagePairFallback />
      </div>
    );
  }

  const vocabPromise = getVocab(user.id, user.activeLanguagePairId);

  return (
    <div className="grid grid-rows-[auto_1fr] space-y-6 justify-items-center items-start">
      <h1 className="text-center text-2xl font-semibold">Vocabulary</h1>
      <div className="space-y-4">
        <RequireActivePairContext>
          <Suspense fallback={<Spinner />}>
            <VocabTable dataPromise={vocabPromise} />
            <AddVocabDialog className="w-full" />
          </Suspense>
        </RequireActivePairContext>
      </div>
    </div>
  );
}
