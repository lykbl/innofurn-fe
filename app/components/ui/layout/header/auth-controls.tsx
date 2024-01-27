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
import { FragmentType, gql, useFragment } from "@/gql";
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
  user: FragmentType<typeof CHECK_ME_FRAGMENT> | null;
}
function UserControls({ user }: IUserControlsProps) {
  const [logoutAsync, { client }] = useMutation(LOGOUT_MUTATION);
  const userData = useFragment(CHECK_ME_FRAGMENT, user);

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
              <p className="text-sm font-medium leading-none">
                {userData?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
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

export const ACTIVE_CART_FRAGMENT = gql(/* GraphQL */ `
  fragment ActiveCartFragment on Cart {
    id
    lines {
      id
      quantity
      purchasable {
        id
        name
      }
    }
  }
`);
export const ACTIVE_CHAT_ROOM_FRAGMENT = gql(/* GraphQL */ `
  fragment ActiveChatRoomFragment on ChatRoom {
    id
    messages {
      ...ChatMessageFragment
    }
  }
`);
export const CHECK_ME_FRAGMENT = gql(/* GraphQL */ `
  fragment CheckMeFragment on User {
    id
    email
    name
    customer {
      id
      fullName
      firstName
      lastName
      role
      activeCart {
        ...ActiveCartFragment
      }
      activeChatRoom {
        id
      }
    }
  }
`);
export const CHECK_ME = gql(/* GraphQL */ `
  query CheckMe {
    checkMe {
      ...CheckMeFragment
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
      {user ? <UserControls user={user} /> : <GuestControls />}
    </div>
  );
}

export default AuthControls;
