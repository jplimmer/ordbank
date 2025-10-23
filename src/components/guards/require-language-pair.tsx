'use client';

import { useLanguagePairContext } from '@/contexts/language-pair';
import { ROUTES } from '@/lib/constants/routes';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Item,
  ItemActions,
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
      <div className="grid justify-items-center items-center w-full h-full">
        <Item variant="outline" className="flex-col sm:flex-row">
          <ItemMedia
            variant="icon"
            className="!self-center sm:!self-start size-10 sm:size-8"
          >
            <ShieldAlert className="size-5 sm:size-4" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>No language selected</ItemTitle>
            <ItemDescription className="text-pretty">
              Please select or create a language pair to continue.
            </ItemDescription>
          </ItemContent>
          <ItemActions className="w-full sm:w-auto">
            <Button
              size="default"
              variant="outline"
              className="w-full sm:w-auto"
              asChild
            >
              <Link href={ROUTES.LANGUAGES}>Languages</Link>
            </Button>
          </ItemActions>
        </Item>
      </div>
    );
  }

  return <>{children}</>;
}
