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

export function LanguageToggle({
  languagePairs,
}: {
  languagePairs: LanguagePair[];
}) {
  const { activePair, setActive } = useLanguagePairContext();

  return (
    <>
      <Select
        value={activePair.id.toString()}
        onValueChange={(value) => {
          const selectedPair = languagePairs.find(
            (lp) => lp.id.toString() === value
          );
          if (selectedPair) {
            setActive(selectedPair);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Languages" />
        </SelectTrigger>
        <SelectContent>
          {languagePairs.map((lp) => (
            <SelectItem key={lp.id} value={lp.id.toString()}>
              {lp.pairName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
