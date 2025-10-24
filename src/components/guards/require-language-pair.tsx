'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { NoLanguagePairFallback } from '../fallbacks/no-language-pair-fallback';

export function RequireLanguagePair({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activePair } = useLanguagePairContext();

  if (!activePair) {
    return <NoLanguagePairFallback />;
  }

  return <>{children}</>;
}
