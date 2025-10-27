import { AddLanguagePairDialog } from '@/components/languages/add-language-pair-dialog';
import { LanguagePairTableEntry } from '@/components/languages/languages-columns';
import { LanguagesTable } from '@/components/languages/languages-table';
import { Spinner } from '@/components/ui/spinner';
import { DATABASE_ERROR } from '@/lib/constants/errors';
import { getCurrentUserOrRedirect } from '@/lib/services/auth';
import {
  getUserLanguagePairs,
  getVocabCountByLanguagePairs,
} from '@/lib/services/language-pairs';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { toast } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Languages',
  description: 'Manage your language pair profiles',
};

export default function LanguagesPage() {
  // Get language pairs for given user profile
  const getLanguagePairs = async (): Promise<LanguagePairTableEntry[]> => {
    // Authenticate user profile
    const user = await getCurrentUserOrRedirect();

    // Get language pairs for user
    const result = await getUserLanguagePairs(user.id);

    // Handle errors
    if (!result.success) {
      toast.error(DATABASE_ERROR);
      return [];
    }

    // Early return if user has no language pairs in database
    if (result.data.length === 0) {
      return [];
    }

    // Get vocab counts for each language pair and map onto original array
    const langPairIds = result.data.map((langPair) => langPair.id);
    const vocabCounts = await getVocabCountByLanguagePairs(langPairIds);
    const tableData: LanguagePairTableEntry[] = result.data.map((langPair) => ({
      ...langPair,
      vocabCount:
        vocabCounts.find((c) => c.langPairId === langPair.id)?.count ?? 0,
    }));

    return tableData;
  };

  return (
    <div className="content-grid grid-rows-[auto_1fr] space-y-10 justify-items-center items-start">
      <h1 className="text-center text-2xl font-semibold">Languages</h1>
      <div className="grid justify-items-center space-y-8">
        <Suspense fallback={<Spinner />}>
          <AddLanguagePairDialog />
          <LanguagesTable dataPromise={getLanguagePairs()} />
        </Suspense>
      </div>
    </div>
  );
}
