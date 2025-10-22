import { getLanguagePairs } from '@/lib/services/language-pairs';
import { LanguageToggle } from './language-toggle';
import { ThemeToggle } from './theme-toggle';

export async function Header() {
  // TO DO - Authenticate user profile with error-handling
  const userId = 1;
  if (!userId) {
    return;
  }

  const result = await getLanguagePairs(userId);
  if (!result.success) {
    return;
  }

  return (
    <header className="full-width content-grid pt-4">
      <div className="flex justify-between">
        <LanguageToggle languagePairs={result.data} />
        <ThemeToggle />
      </div>
    </header>
  );
}
