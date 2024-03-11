import { FragmentType, useFragment } from '@/gql/generated';
import { CheckMeFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useMutation } from '@apollo/client';
import { LogoutMutation } from '@/gql/mutations/user';
import { Button } from '@/components/ui/common/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BaseLink from 'next/link';
import ROUTES from '@/lib/routes';
import * as React from 'react';
import { cn } from '@/lib/utils';

const UserPopover = ({
  user,
}: {
  user?: FragmentType<typeof CheckMeFragmentFragmentDoc> | null;
}) => {
  const [logoutAsync, { client }] = useMutation(LogoutMutation);
  const userData = useFragment(CheckMeFragmentFragmentDoc, user);

  const handleLogout = async () => {
    await logoutAsync();
    client.resetStore();
  };

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://avatars.githubusercontent.com/u/23196361?v=4" />
              <AvatarFallback>KK</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userData?.name || 'Guest'}
              </p>
              <p
                className={cn(
                  'text-xs leading-none text-muted-foreground',
                  !userData?.email && 'hidden',
                )}
              >
                {userData?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <BaseLink href={ROUTES.BOOKMARKS}>Favourites</BaseLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BaseLink href={ROUTES.PROFILE}>Profile</BaseLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BaseLink href={ROUTES.SETTINGS}>Settings</BaseLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Button
              className="h-8 w-full justify-start px-2 py-1.5 font-normal"
              onClick={handleLogout}
              variant="ghost"
              size="sm"
            >
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserPopover;
