import { getCurrentUser } from '@/lib/services/auth';
import { getUserLanguagePairs } from '@/lib/services/language-pairs';
import { LanguagePair } from '@/lib/types/language-pair';
import { LanguageSelect } from './language-select';
import { ThemeToggle } from './theme-toggle';

export async function Header() {
  let languagePairs: LanguagePair[] = [];
  let error: string | null = null;

  // Authenticate user profile
  const user = await getCurrentUser();

  if (user) {
    const result = await getUserLanguagePairs(user.id);
    if (result.success) {
      languagePairs = result.data;
    } else {
      error = 'No language pairs found';
    }
  }

  return (
    <header className="full-width content-grid py-4">
      <div className="flex justify-between">
        <LanguageSelect languagePairs={languagePairs} error={error} />
        <ThemeToggle />
      </div>
    </header>
  );
}
