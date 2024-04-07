import React from 'react';
import { cn } from '@/lib/utils';

//TODO combine with shadcn separator
export function SeparatorWithText({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className={cn("relative flex justify-center bg-background left-[50%] translate-x-[-50%] w-max px-2", className)}>
        {children}
      </div>
    </div>
  );
}
