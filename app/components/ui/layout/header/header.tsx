'use client';

import BaseLink from 'next/link';
import ROUTES from '@/lib/routes';
import { Suspense } from 'react';
import NotificationsTriggerSkeleton from '@/components/ui/layout/header/notifications-popover/notifications-trigger-skeleton';
import NotificationsPopover from '@/components/ui/layout/header/notifications-popover/notifications-popover';
import CartTriggerSkeleton from '@/components/ui/layout/header/cart-popover/cart-trigger-skeleton';
import { CartPopover } from '@/components/ui/layout/header/cart-popover/cart-control';
import UserMenu from '@/components/ui/layout/header/user-popover/user-menu';
import * as React from 'react';
import { useQuery } from '@apollo/client';
import { CheckMeQuery } from '@/gql/queries/user';
import { Icons } from '@/components/icons';
import GuestMenu from '@/components/ui/layout/header/user-popover/guest-popover';
import SearchBar from '@/components/ui/layout/header/search-bar';

const Header = () => {
  const { data, loading } = useQuery(CheckMeQuery);
  const user = data?.checkMe ?? null;

  return (
    <div className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-2 py-3">
        <div className="flex w-1/5 items-center">
          <BaseLink
            href={ROUTES.HOME}
            className="rounded border border-transparent p-2 hover:border-black"
          >
            <Icons.logo />
          </BaseLink>
        </div>
        <div className="flex h-min w-3/5 items-center justify-between rounded">
          <SearchBar />
        </div>
        <div className="flex w-1/5 items-center justify-end">
          <div className="flex items-center gap-3">
            <Suspense fallback={<NotificationsTriggerSkeleton />}>
              <NotificationsPopover />
            </Suspense>
            <Suspense fallback={<CartTriggerSkeleton />}>
              <CartPopover />
            </Suspense>
            {user && <UserMenu user={user} />}
            {!user && <GuestMenu />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
