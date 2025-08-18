import { ROUTES } from '@/lib/routes';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center gap-4 min-h-full">
      <h1 className="mb-4">Ordbank</h1>
      <Link
        href={ROUTES.ADD_WORD}
        className="border rounded-2xl p-6 text-center hover:shadow-md w-1/2"
      >
        Add Word
      </Link>
      <Link
        href={ROUTES.TEST}
        className="border rounded-2xl p-6 text-center hover:shadow-md w-1/2"
      >
        Test
      </Link>
    </main>
  );
}
