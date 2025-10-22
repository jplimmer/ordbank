import { getLanguagePairs } from '@/lib/services/language-pairs';
import { getCurrentUser } from '@/lib/services/user';
import { LanguagePair } from '@/lib/types/language-pair';
import { LanguageSelect } from './language-select';
import { ThemeToggle } from './theme-toggle';

export async function Header() {
  let languagePairs: LanguagePair[] = [];
  let error: string | null = null;

  // Authenticate user profile
  const user = await getCurrentUser();

  if (user) {
    const result = await getLanguagePairs(user.id);
    if (result.success) {
      languagePairs = result.data;
    } else {
      error = result.error;
    }
  }

  return (
    <header className="full-width content-grid pt-4">
      <div className="flex justify-between">
        <LanguageSelect languagePairs={languagePairs} error={error} />
        <ThemeToggle />
      </div>
    </header>
  );
}
