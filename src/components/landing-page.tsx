import { ROUTES } from '@/lib/constants/routes';
import Link from 'next/link';
import { Button } from './ui/button';

const buttonStyle = 'text-lg h-fit w-40 px-8 py-4 ';

export function LandingPage() {
  return (
    <div className="grid place-items-center py-4">
      <div className="grid gap-6 px-4 sm:px-10 text-center text-pretty">
        <h1 className="font-semibold text-3xl text-center">
          Welcome to Ordbank!
        </h1>
        <p className="text-muted-foreground">
          Ordbank helps you learn words that you struggle to remember.
        </p>
        <p className="text-muted-foreground">
          Create your own list of words and translations that are important to
          you, and test yourself to commit them to memory.
        </p>
        <p className="text-muted-foreground">
          Sign-in to get started, or read the user guide to find out more!
        </p>
        <div className="flex flex-col min-[520px]:flex-row items-center justify-center gap-4 sm:gap-8">
          <Button className={buttonStyle} asChild>
            <Link href={ROUTES.SIGNIN}>Sign-in</Link>
          </Button>
          <Button variant="secondary" className={buttonStyle} asChild>
            <Link href={ROUTES.USER_GUIDE}>User guide</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
