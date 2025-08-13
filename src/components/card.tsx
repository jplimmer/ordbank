import Link from 'next/link';

export default function Card({
  title,
  link,
  className,
}: {
  title: string;
  link?: string;
  className?: string;
}) {
  return (
    <div
      className={`border rounded p-4 text-center hover:shadow-md ${className}`}
    >
      {link ? (
        <Link href={link}>
          <span>{title}</span>
        </Link>
      ) : (
        <span>{title}</span>
      )}
    </div>
  );
}
