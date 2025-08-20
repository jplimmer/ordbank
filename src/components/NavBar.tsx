import { ROUTES } from '@/lib/routes';
import { BookType, Heart, Info } from 'lucide-react';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="mb-4 py-4">
      <ul className="flex justify-around">
        <li>
          <Link href={ROUTES.USER_GUIDE}>
            <Info size={32} />
          </Link>
        </li>
        <li>
          <Link href={ROUTES.VOCAB}>
            <BookType size={32} />
          </Link>
        </li>
        <li>
          <Link href={ROUTES.HEALTH_CHECK}>
            <Heart size={32} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
