'use client';

import BaseLink from 'next/link';
import ROUTES from '@/lib/routes';
import { BiBell, BiShoppingBag } from 'react-icons/bi';
import { FragmentType, gql, useFragment } from '@/gql';
import { Button } from '@/components/ui/common/button';
import { useMutation, useQuery } from '@apollo/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/common/card';
import Image from 'next/image';
import { formatToCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/common/separator';
import { CartLineFragmentFragmentDoc } from '@/gql/graphql';

const LOGOUT_MUTATION = gql(/* GraphQL */ `
  mutation Logout {
    logout {
      id
    }
  }
`);

const CartLineFragment = gql(/* GraphQL */ `
  fragment CartLineFragment on CartLine {
    id
    quantity
    purchasable {
      id
      name
      images(primaryOnly: true) {
        data {
          originalUrl
          name
        }
      }
      prices {
        id
        price
      }
    }
  }
`);

const CART_QUERY = gql(/* GraphQL */ `
  query MyCart {
    myCart {
      id
      lines {
        ...CartLineFragment
      }
    }
  }
`);

function CartControls() {
  const { data: myCartQuery, loading } = useQuery(CART_QUERY);

  if (loading || myCartQuery === undefined) {
    return <>...</>;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="relative">
          <BiShoppingBag size={24} />
          {myCartQuery.myCart.lines.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-2xs font-medium text-white">
              {myCartQuery.myCart.lines.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end" forceMount asChild>
        <CartItems lines={myCartQuery.myCart.lines} />
      </PopoverContent>
    </Popover>
  );
}

const CartItems = ({
  lines,
}: {
  lines: Array<FragmentType<typeof CartLineFragmentFragmentDoc>>;
}) => {
  return (
    <Card className="w-64 p-2">
      <CardContent className="p-2">
        <h3 className="text-lg font-medium">Your cart</h3>
        <ul>
          {lines.map((line) => (
            <CartItemLine
              key={useFragment(CartLineFragmentFragmentDoc, line).id}
              lineFragment={line}
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const CartItemLine = ({
  lineFragment,
}: {
  lineFragment: FragmentType<typeof CartLineFragmentFragmentDoc>;
}) => {
  const line = useFragment(CartLineFragmentFragmentDoc, lineFragment);

  return (
    <li className="flex gap-2 rounded border-b border-solid border-secondary p-1">
      <Image
        src={line.purchasable.images.data[0].originalUrl}
        alt={line.purchasable.images.data[0].name}
        width={50}
        height={50}
      />
      <div className="text-xs">
        <h4>{line.purchasable.name}</h4>
        <p>
          {line.quantity} x{' '}
          {formatToCurrency(line.purchasable.prices[0].price.value)}
        </p>
        <Separator orientation="horizontal" className="my-0.5" />
        <span className="text-foreground">
          Subtotal:{' '}
          {formatToCurrency(
            line.quantity * line.purchasable.prices[0].price.value,
          )}
        </span>
      </div>
    </li>
  );
};

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
    <div className="flex items-center gap-2">
      <NotificationsControls />
      <CartControls />
      {user ? <UserControls user={user} /> : <GuestControls />}
    </div>
  );
}

export default AuthControls;
