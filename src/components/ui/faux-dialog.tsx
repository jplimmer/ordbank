import { XIcon } from 'lucide-react';
import Link from 'next/link';

export function FauxDialog({
  children,
  closeHref,
}: {
  children: React.ReactNode;
  closeHref: string;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs">
      <div
        className="
            fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full bg-background gap-4 rounded-lg border shadow-lg duration-200 max-w-lg p-6 pt-8 space-y-8"
      >
        <Link
          href={closeHref}
          className="rounded-full ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          <XIcon />
          <span className="sr-only">Close</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
