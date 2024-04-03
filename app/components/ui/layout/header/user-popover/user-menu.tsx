import { FragmentType, gql, useFragment } from '@/gql/generated';
import {
  CheckMeFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { LogoutMutation } from '@/gql/mutations/user';
import { Button, buttonVariants } from '@/components/ui/common/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BaseLink from 'next/link';
import ROUTES from '@/lib/routes';
import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/common/separator';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Suspense } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

export default function UserPopover({
  user,
}: {
  user?: FragmentType<typeof CheckMeFragmentFragmentDoc> | null;
}) {
  const [logoutAsync, { client }] = useMutation(LogoutMutation);
  const userData = useFragment(CheckMeFragmentFragmentDoc, user);

  const handleLogout = async () => {
    await logoutAsync();
    client.resetStore();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-[40px] w-[42px] rounded-full border border-primary p-0"
        >
          <Avatar className="h-full w-full">
            <AvatarImage src="https://avatars.githubusercontent.com/u/23196361?v=4" />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-56 flex-col gap-1"
        align="end"
        forceMount
      >
        <div className="flex flex-col gap-2 p-2 font-normal">
          <p className="text-sm font-medium leading-none">{userData?.name}</p>
          <p className="text-xs leading-none text-muted-foreground">
            {userData?.email}
          </p>
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            asChild
            className="h-8 w-full justify-start px-2 py-1"
          >
            <BaseLink href={ROUTES.BOOKMARKS}>Favorites</BaseLink>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-8 w-full justify-start px-2 py-1"
          >
          <BaseLink href={ROUTES.PROFILE}>Profile</BaseLink>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-8 w-full justify-start px-2 py-1"
          >
            <BaseLink href={ROUTES.SETTINGS}>Settings</BaseLink>
          </Button>
        </div>
        <Separator />
        <Button asChild variant="ghost">
          <BaseLink href="/recently-viewed">
            Recently Viewed
          </BaseLink>
        </Button>
        <Separator />
        <div>
          <Button
            className="h-8 w-full px-2 py-1.5"
            onClick={handleLogout}
            variant="default"
          >
            Log out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
