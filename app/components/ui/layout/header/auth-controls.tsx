"use client";

import BaseLink from "next/link";
import ROUTES from "@/lib/routes";
import {
  BiBell,
  BiHeart,
  BiNotification,
  BiShoppingBag,
  BiUser,
} from "react-icons/bi";
import { gql } from "@/gql";
import { Button } from "@/components/ui/common/button";
import { useMutation, useQuery } from "@apollo/client";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/components/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { User } from "@/gql/graphql";

const LOGOUT_MUTATION = gql(/* GraphQL */ `
  mutation Logout {
    logout {
      id
    }
  }
`);

function CartControls() {
  return (
    <Button variant="outline">
      <BiShoppingBag size={24} />
    </Button>
  );
}

function NotificationsControls() {
  return (
    <Button variant="outline">
      <BiBell size={24} />
    </Button>
  );
}

interface IUserControlsProps {
  user: User | null;
}
function UserControls({ user }: IUserControlsProps) {
  const [logoutAsync, { client }] = useMutation(LOGOUT_MUTATION);

  const handleLogout = async () => {
    await logoutAsync();
    client.resetStore();
  };

  return (
    <div className="flex gap-4 items-center">
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
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
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
              className="font-normal w-full justify-start px-2 py-1.5 h-8"
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
}
function GuestControls() {
  return (
    <Button variant="outline">
      <BaseLink href={ROUTES.LOGIN}>Login</BaseLink>
    </Button>
  );
}

const CHECK_ME = gql(/* GraphQL */ `
  query CheckMe {
    checkMe {
      id
      email
      name
    }
  }
`);
function AuthControls() {
  const { data, loading } = useQuery(CHECK_ME);
  const user = data?.checkMe ?? null;

  if (loading) {
    return <>Controls skeleton</>;
  }

  return (
    <div className="flex gap-2 items-center">
      <NotificationsControls />
      <CartControls />
      {user ? (
        <UserControls user={user} />
      ) : (
        <GuestControls />
      )}
    </div>
  );
}

export default AuthControls;
