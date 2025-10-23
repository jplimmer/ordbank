import { AddLanguagePairDialog } from '@/components/languages/add-language-pair-dialog';
import { LanguagePairTableEntry } from '@/components/languages/languages-columns';
import { LanguagesTable } from '@/components/languages/languages-table';
import { Spinner } from '@/components/ui/spinner';
import {
  getLanguagePairs,
  getVocabCountByLanguagePairs,
} from '@/lib/services/language-pairs';
import { getCurrentUser } from '@/lib/services/user';
import { Suspense } from 'react';

export default function AccountPage() {
  // Get language pairs for given user profile
  const getUserLanguagePairs = async (): Promise<LanguagePairTableEntry[]> => {
    // Authenticate user profile
    const user = await getCurrentUser();

    if (!user) {
      // TO DO - redirect to login?
      return [];
    }

    // Get language pairs for user
    const result = await getLanguagePairs(user.id);
    if (!result.success) {
      // TO DO - handle errors
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
          <LanguagesTable dataPromise={getUserLanguagePairs()} />
        </Suspense>
      </div>
    </div>
  );
}
