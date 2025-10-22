'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { LanguagePair } from '@/lib/types/language-pair';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function LanguageSelect({
  languagePairs,
  error,
}: {
  languagePairs: LanguagePair[];
  error?: string | null;
}) {
  const { activePair, setActive } = useLanguagePairContext();
  const hasError = !!error || languagePairs.length === 0;

  return (
    <Select
      value={activePair?.id.toString() ?? ''}
      onValueChange={(value) => {
        const selectedPair = languagePairs.find(
          (lp) => lp.id.toString() === value
        );
        if (selectedPair) {
          setActive(selectedPair);
        }
      }}
      disabled={hasError}
    >
      <SelectTrigger>
        <SelectValue placeholder="Languages" />
      </SelectTrigger>
      <SelectContent align="start">
        {languagePairs.map((lp) => (
          <SelectItem key={lp.id} value={lp.id.toString()}>
            {lp.pairName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
