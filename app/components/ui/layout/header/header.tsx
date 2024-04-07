'use client';

import BaseLink from 'next/link';
import ROUTES from '@/lib/routes';
import { Suspense, useContext } from 'react';
import NotificationsTriggerSkeleton from '@/components/ui/layout/header/notifications-popover/notifications-trigger-skeleton';
import NotificationsPopover from '@/components/ui/layout/header/notifications-popover/notifications-popover';
import CartTriggerSkeleton from '@/components/ui/layout/header/cart-popover/cart-trigger-skeleton';
import CartPopover from '@/components/ui/layout/header/cart-popover/cart-control';
import UserMenu from '@/components/ui/layout/header/user-popover/user-menu';
import * as React from 'react';
import { useQuery } from '@apollo/client';
import { CheckMeQuery } from '@/gql/queries/user';
import { Icons } from '@/components/icons';
import GuestMenu from '@/components/ui/layout/header/user-popover/guest-popover';
import SearchBar from '@/components/ui/layout/header/search-bar/search-bar';
import { Button } from '@/components/ui/common/button';
import { ThemeContext, THEMES } from '@/components/theme.context';

const Header = () => {
  const { data, loading, error } = useQuery(CheckMeQuery);
  const user = data?.checkMe;
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="w-full border-b bg-background">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-2 py-3">
        <div className="flex w-1/5 items-center">
          <Button asChild variant="outline">
            <BaseLink href={ROUTES.HOME} className="text-primary">
              <Icons.logo fill="white" />
            </BaseLink>
          </Button>
        </div>
        <div className="flex h-min w-3/5 items-center justify-between rounded">
          <SearchBar />
        </div>
        <div className="flex w-1/5 items-center justify-end text-primary">
          <div className="flex items-center gap-3">
            <Button onClick={toggleTheme} variant="outline">
              {theme === THEMES.DARK ? <Icons.sun /> : <Icons.moon />}
            </Button>
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
