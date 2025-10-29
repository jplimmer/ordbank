import { ROUTES } from '@/lib/constants/routes';
import Link from 'next/link';
import { Button } from './ui/button';
import { CreateDialog } from './vocab';

const buttonStyle =
  'w-1/2 h-fit rounded-xl p-6 text-xl cursor-pointer hover:shadow-md capitalize';

export function Home() {
  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-5xl mb-8">Ordbank</h1>
      <CreateDialog variant="secondary" className={buttonStyle} />
      <Button className={buttonStyle} asChild>
        <Link href={ROUTES.TEST} className="">
          Test
        </Link>
      </Button>
    </div>
  );
}
