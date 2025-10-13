'use client';

import { LanguagePair } from '@/lib/types/language-pair';
import { createContext, use, useMemo, useState } from 'react';

type LanguagePairContextType = {
  activePair: LanguagePair;
  switchPair: (newPair: LanguagePair) => void;
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
  const [activePair, setActivePair] = useState<LanguagePair>(initialPair);

  const switchPair = (newPair: LanguagePair) => {
    setActivePair(newPair);
  };

  const value: LanguagePairContextType = useMemo(
    () => ({
      activePair,
      switchPair,
    }),
    [activePair]
  );

  return <LanguagePairContext value={value}>{children}</LanguagePairContext>;
}

export function useLanguagePairContext() {
  const context = use(LanguagePairContext);
  if (!context) {
    throw new Error(
      'useLanguagePairContext must be used within a LanguagePairProvider'
    );
  }
  return context;
}
