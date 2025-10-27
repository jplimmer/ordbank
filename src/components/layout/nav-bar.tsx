'use client';

import { ROUTES } from '@/lib/constants/routes';
import { Home, Info, NotepadText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { AccountMenu } from './account-menu';

export function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === ROUTES.HOME;

  return (
    <nav className="py-4">
      <ul className="flex justify-around">
        <li>
          <AccountMenu />
        </li>
        <li>
          <Button variant="ghost" className="py-2" asChild>
            <Link
              href={isHome ? ROUTES.VOCABULARY : ROUTES.HOME}
              aria-label={isHome ? 'Vocab list' : 'Home'}
              className="h-fit"
            >
              {isHome ? (
                <NotepadText className="size-8" />
              ) : (
                <Home className="size-8" />
              )}
            </Link>
          </Button>
        </li>
        <li>
          <Button variant="ghost" className="py-2" asChild>
            <Link
              href={ROUTES.USER_GUIDE}
              aria-label="User guide"
              className="h-fit"
            >
              <Info className="size-8" />
            </Link>
          </Button>
        </li>
      </ul>
    </nav>
  );
}
