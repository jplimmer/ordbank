'use client';

import { LanguagePair } from '@/lib/types/language-pair';
import { createContext, use } from 'react';

type LanguagePairContextType = {
  activePair: LanguagePair;
  //   switchPair: (languagePairId: number) => Promise<void>;
  //   isLoading: boolean;
};

const LanguagePairContext = createContext<LanguagePairContextType | undefined>(
  undefined
);

export function LanguagePairProvider({
  children,
  initialPair,
}: {
  children: React.ReactNode;
  initialPair: LanguagePair;
}) {
  // const [activePair, setActivePair] = useState<LanguagePair>(initialPair);
  // const [isLoading, setIsLoading] = useState(false);

  return (
    <LanguagePairContext value={{ activePair: initialPair }}>
      {children}
    </LanguagePairContext>
  );
}

export function useLanguagePairContext() {
  const ctx = use(LanguagePairContext);
  if (!ctx) {
    throw new Error(
      'useLanguagePairContext must be used within a LanguagePairProvider'
    );
  }
  return ctx;
}
