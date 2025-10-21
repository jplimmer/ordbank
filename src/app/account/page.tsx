import { AddLanguagePairDialog } from '@/components/languages/add-language-pair-dialog';
import { LanguagesTable } from '@/components/languages/languages-table';
import { Spinner } from '@/components/ui/spinner';
import { getCurrentProfile } from '@/lib/services/auth';
import { getLanguagePairs } from '@/lib/services/language-pairs';
import { LanguagePair } from '@/lib/types/language-pair';
import { Suspense } from 'react';

export default function AccountPage() {
  // Get language pairs for given user profile
  const getUserLanguagePairs = async (): Promise<LanguagePair[]> => {
    // Authenticate user profile
    const profileCheck = await getCurrentProfile();
    if (!profileCheck.success) {
      // TO DO - redirect to login?
      return [];
    }

    const result = await getLanguagePairs(profileCheck.data.userId);
    if (!result.success) {
      // TO DO - handle errors
      return [];
    }
    return result.data;
  };

  return (
    <div className="content-grid grid-rows-[auto_1fr] space-y-10 justify-items-center items-start">
      <h1 className="text-center text-2xl font-semibold">Languages</h1>
      <div className="space-y-8">
        <Suspense fallback={<Spinner />}>
          <AddLanguagePairDialog className="w-full" />
          <LanguagesTable dataPromise={getUserLanguagePairs()} />
        </Suspense>
      </div>
    </div>
  );
}
