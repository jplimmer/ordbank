import { ROUTES } from '@/lib/constants/routes';
import { FallbackItem } from '../ui/fallback-item';

export function NoLanguagePairFallback() {
  return (
    <FallbackItem
      title="No language selected"
      description="Please select or create a language pair to continue."
      linkButton={true}
      linkButtonHref={ROUTES.LANGUAGES}
      linkButtonText="Languages"
    />
  );
}
