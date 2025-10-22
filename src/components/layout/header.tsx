import { getLanguagePairs } from '@/lib/services/language-pairs';
import { LanguagePair } from '@/lib/types/language-pair';
import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';

export async function Header() {
  // TO DO - Authenticate user profile with error-handling
  const userId = 1;
  let languagePairs: LanguagePair[] = [];
  let error: string | null = null;

  if (userId) {
    const result = await getLanguagePairs(userId);
    console.log(result);
    if (result.success) {
      languagePairs = result.data;
    } else {
      error = result.error;
    }
  }

  return (
    <header className="full-width content-grid pt-4">
      <div className="flex justify-between">
        <LanguageToggle languagePairs={languagePairs} error={error} />
        <ThemeToggle />
      </div>
    </header>
  );
}
