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
          <Link href={ROUTES.ACCOUNT}>
            <UserRound size={32} />
          </Link>
        </li>
        <li>
          <Link href={isHome ? ROUTES.VOCAB : ROUTES.HOME}>
            {isHome ? <BookType size={32} /> : <Home size={32} />}
          </Link>
        </li>
        <li>
          <Link href={ROUTES.USER_GUIDE}>
            <Info size={32} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
