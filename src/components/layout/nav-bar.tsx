'use client';

import { ROUTES } from '@/lib/constants/routes';
import { BookType, Home, Info, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === ROUTES.HOME;

  return (
    <nav className="mb-4 py-4">
      <ul className="flex justify-around">
        <li>
          <Link href={ROUTES.ACCOUNT} aria-label="Account">
            <UserRound size={32} />
          </Link>
        </li>
        <li>
          <Link
            href={isHome ? ROUTES.VOCAB : ROUTES.HOME}
            aria-label={isHome ? 'Vocab list' : 'Home'}
          >
            {isHome ? <BookType size={32} /> : <Home size={32} />}
          </Link>
        </li>
        <li>
          <Link href={ROUTES.USER_GUIDE} aria-label="User guide">
            <Info size={32} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
