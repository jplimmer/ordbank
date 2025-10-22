'use client';

import { ROUTES } from '@/lib/constants/routes';
import { useClerk } from '@clerk/nextjs';
import { BookType, Home, Info, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === ROUTES.HOME;

  const { signOut } = useClerk();

  return (
    <nav className="pb-4">
      <ul className="flex justify-around">
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="py-2 h-fit cursor-pointer">
                <UserRound className="size-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="text-lg">
                <Link
                  href={ROUTES.ACCOUNT}
                  aria-label="Account"
                  className="h-fit"
                >
                  Languages
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-lg" onClick={() => signOut()}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
        <li>
          <Button variant="ghost" className="py-2" asChild>
            <Link
              href={isHome ? ROUTES.VOCAB : ROUTES.HOME}
              aria-label={isHome ? 'Vocab list' : 'Home'}
              className="h-fit"
            >
              {isHome ? (
                <BookType className="size-8" />
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
