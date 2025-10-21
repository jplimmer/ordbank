'use client';

import { setActiveLanguagePair } from '@/lib/actions/active-language-pair';
import { LanguagePair } from '@/lib/types/language-pair';
import {
  createContext,
  use,
  useCallback,
  useState,
  useTransition,
} from 'react';
import { toast } from 'react-hot-toast';

type LanguagePairContextType = {
  activePair: LanguagePair;
  setActive: (newPair: LanguagePair) => void;
  isLoading: boolean;
  error: string | null;
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
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setActive = useCallback((newPair: LanguagePair) => {
    setError(null);

    startTransition(async () => {
      const result = await setActiveLanguagePair(newPair.id);
      if (result.success) {
        // Update state with server response
        setActivePair(result.data);
      } else {
        setError(result.error || 'Failed to update language pair');
        toast.error(
          `Could not switch to ${newPair.pairName}, please try again`
        );
      }
    });
  }, []);

  const value: LanguagePairContextType = {
    activePair,
    setActive,
    isLoading,
    error,
  };

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
