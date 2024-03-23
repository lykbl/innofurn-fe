import * as React from 'react';

import { cn } from '@/lib/utils';
import BaseLink from 'next/link';

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, className, type, ...props }, ref) => {
    return (
      <BaseLink
        href={href || ''}
        className={cn('hover:underline hover:underline-offset-4', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Link.displayName = 'Link';

export { Link };
