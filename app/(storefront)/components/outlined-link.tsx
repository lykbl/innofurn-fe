import { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const OutlinedLink = ({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) => {
  return (
    <Link
      className={cn(
        'flex w-max rounded border border-primary p-1 transition-all  hover:ring-1 hover:ring-primary hover:ring-offset-0 hover:ring-offset-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0',
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
};

export default OutlinedLink;
