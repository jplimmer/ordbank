import { ROUTES } from '@/lib/constants/routes';
import { BookType, Info, UserRound } from 'lucide-react';
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="mb-4 py-4">
      <ul className="flex justify-around">
        <li>
          <Link href={ROUTES.ACCOUNT}>
            <UserRound size={32} />
          </Link>
        </li>
        <li>
          <Link href={ROUTES.VOCAB}>
            <BookType size={32} />
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
