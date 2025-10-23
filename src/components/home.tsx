import { ROUTES } from '@/lib/constants/routes';
import Link from 'next/link';
import { Button } from './ui/button';

const buttonStyle = 'w-1/2 h-fit rounded-xl p-6 text-xl hover:shadow-md';

export function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-3xl mb-8">Ordbank</h1>
      <Button variant="secondary" className={buttonStyle} asChild>
        <Link href={ROUTES.VOCAB}>Add Word</Link>
      </Button>
      <Button className={buttonStyle} asChild>
        <Link href={ROUTES.TEST} className="">
          Test
        </Link>
      </Button>
    </div>
  );
}
