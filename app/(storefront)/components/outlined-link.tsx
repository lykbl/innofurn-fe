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
        'flex rounded border border-transparent p-1 transition-all hover:border-primary',
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
};

export default OutlinedLink;
