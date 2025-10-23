'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { ShieldAlert } from 'lucide-react';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../ui/item';

export function RequireLanguagePair({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activePair } = useLanguagePairContext();

  if (!activePair) {
    return (
      <div className="full-width content-grid justify-items-center items-center w-full h-full">
        <Item variant="outline" className="flex w-full max-w-md bg-white ">
          <ItemMedia variant="icon">
            <ShieldAlert />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>No language selected</ItemTitle>
            <ItemDescription className="text-wrap">
              Please select or create a language pair to continue.
            </ItemDescription>
          </ItemContent>
        </Item>
      </div>
    );
  }

  return <>{children}</>;
}
