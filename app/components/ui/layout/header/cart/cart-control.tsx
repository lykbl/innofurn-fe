import { useQuery } from '@apollo/client';
import { gql, useFragment } from '@/gql/generated';
import { CartFragmentFragment, CartFragmentFragmentDoc } from '@/gql/generated/graphql';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/common/button';
import { BiShoppingBag } from 'react-icons/bi';
import * as React from 'react';
import { CartItems } from '@/components/ui/layout/header/cart/cart-items';

const CART_QUERY = gql(/* GraphQL */ `
  query MyCart {
    myCart {
      ...CartFragment
    }
  }
`);

const CartFragment = gql(/* GraphQL */ `
  fragment CartFragment on Cart {
    id
    total
    taxTotal
    discountTotal
    lines {
      ...CartLineFragment
    }
  }
`);

export const CartPopover = () => {
  const { data: myCartQuery, loading } = useQuery(CART_QUERY);
  const myCart = useFragment(CartFragmentFragmentDoc, myCartQuery?.myCart);

  return (
    <Popover>
      <Trigger disabled={loading} itemsCount={myCart?.lines.length} />
      <Content myCart={myCart} />
    </Popover>
  );
};

const Trigger = ({
  itemsCount,
  disabled,
}: {
  itemsCount?: number;
  disabled: boolean;
}) => {
  return (
    <PopoverTrigger asChild>
      <Button disabled={disabled} variant="outline" className="relative">
        <BiShoppingBag size={24} />
        <ItemsCounter itemsCount={itemsCount} />
      </Button>
    </PopoverTrigger>
  );
};

const ItemsCounter = ({ itemsCount }: { itemsCount?: number }) => {
  if (!itemsCount) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-2xs font-medium text-white">
      {itemsCount}
    </span>
  );
};

const Content = ({ myCart }: { myCart?: CartFragmentFragment | null }) => {
  if (!myCart) {
    return null;
  }

  return (
    <PopoverContent className="w-64 p-1" align="end" forceMount asChild>
      <CartItems myCart={myCart} />
    </PopoverContent>
  );
};
