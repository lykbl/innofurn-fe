import { Button, buttonVariants } from '@/components/ui/common/button';
import BaseLink from 'next/link';
import ROUTES from '@/lib/routes';
import * as React from 'react';
import { Icons } from '@/components/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/common/separator';
import { cn } from '@/lib/utils';

//TODO trigger link on space bar press
const GhostLink = ({ href, children }: { href: string; children: string }) => (
  <BaseLink
    href={href}
    className={cn(
      buttonVariants({
        variant: 'ghost',
        className: 'h-8 w-full justify-start px-2 py-1',
      }),
    )}
  >
    {children}
  </BaseLink>
);

export default function GuestMenu() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative rounded-full p-3">
          <Icons.user className="h-full w-full" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-56 flex-col gap-2 p-1"
        align="end"
        forceMount
      >
        <p className="px-2 pt-2 font-semibold">Welcome, Guest</p>
        <Separator />
        <div className="flex w-full flex-col gap-1">
          <GhostLink href={ROUTES.BOOKMARKS}>Recently Viewed</GhostLink>
          <GhostLink href={ROUTES.SETTINGS}>3D Room Planner</GhostLink>
          <GhostLink href={ROUTES.PROFILE}>Help & Contact</GhostLink>
        </div>
        <Separator />
        <div className="flex w-full flex-col gap-2">
          <BaseLink
            href={ROUTES.LOGIN}
            className={buttonVariants({
              variant: 'default',
              className:
                'focus:rin h-8 w-full text-left focus:bg-primary/90 focus:text-white',
            })}
          >
            Log in
          </BaseLink>
          <BaseLink
            href={ROUTES.SIGNUP}
            className={buttonVariants({
              variant: 'outline',
              className: 'h-8 w-full text-left',
            })}
          >
            Sign up
          </BaseLink>
        </div>
      </PopoverContent>
    </Popover>
  );
}
