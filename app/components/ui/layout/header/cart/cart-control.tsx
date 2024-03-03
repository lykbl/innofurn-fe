import { useQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import {
  CartFragmentFragment,
  CartFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/common/button';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { CartItems } from '@/components/ui/layout/header/cart/cart-items';
import { MyCartQuery } from '@/gql/queries/cart';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

export const CartPopover = () => {
  const [cartUpdated, setCartUpdated] = useState(false);
  const {
    data: myCartQuery,
    loading,
    observable: queryObserver,
  } = useQuery(MyCartQuery);
  const myCart = useFragment(CartFragmentFragmentDoc, myCartQuery?.myCart);
  let timeoutId = useRef<NodeJS.Timeout | null>();

  const startTimer = () => {
    setCartUpdated(true);
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(() => {
      setCartUpdated(false);
      timeoutId.current = null;
    }, 1000);
  };

  useEffect(() => {
    const subscriber = queryObserver.subscribe({
      next: (data) => {
        startTimer();
      },
    });

    return () => subscriber.unsubscribe();
  }, []);

  return (
    <Popover>
      <Trigger
        disabled={loading}
        itemsCount={myCart?.lines.length}
        cartUpdated={cartUpdated}
      />
      <Content myCart={myCart} />
    </Popover>
  );
};

const Trigger = ({
  itemsCount,
  disabled,
  cartUpdated,
}: {
  itemsCount?: number;
  disabled: boolean;
  cartUpdated: boolean;
}) => {
  return (
    <PopoverTrigger asChild>
      <Button disabled={disabled} variant="outline" className="relative">
        <Icons.shoppingBag />
        <ItemsCounter itemsCount={itemsCount} cartUpdated={cartUpdated} />
      </Button>
    </PopoverTrigger>
  );
};

const ItemsCounter = ({
  itemsCount,
  cartUpdated,
}: {
  itemsCount?: number;
  cartUpdated: boolean;
}) => {
  if (!itemsCount) return null;

  return (
    <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-2xs font-medium text-white">
      <span
        className={cn(
          'absolute h-full w-full rounded-full bg-primary',
          cartUpdated && 'animate-ping',
        )}
      />
      <span className="z-10">{itemsCount}</span>
    </div>
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
