import { PriceData } from '@/gql/scalars';
import { forwardRef } from 'react';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/common/card';
import { CartItem } from '@/components/ui/layout/header/cart/cart-item';
import {
  CartFragmentFragment,
  CartLineFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useFragment } from '@/gql/generated';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/common/button';
import { PopoverClose } from '@radix-ui/react-popover';

type CartItemsProps = {
  myCart: CartFragmentFragment;
};

export const CartItems = forwardRef<
  React.ElementRef<typeof Card>,
  React.ComponentPropsWithoutRef<typeof Card> & CartItemsProps
>(({ myCart, ...props }, forwardRef) => {
  const { lines, total, taxTotal, discountTotal } = myCart;

  return (
    <Card className="w-64 p-2" ref={forwardRef} {...props}>
      <CardContent className="flex flex-col gap-2 p-2">
        <h3 className="text-lg font-medium">Your cart</h3>
        <ul>
          {lines.map((line) => (
            <CartItem
              key={useFragment(CartLineFragmentFragmentDoc, line).id}
              lineFragment={line}
            />
          ))}
        </ul>
        <Totals linesCount={lines.length} total={total} />
      </CardContent>
    </Card>
  );
});

const Totals = ({
  linesCount,
  total,
}: {
  linesCount: number;
  total: PriceData;
}) => {
  if (linesCount === 0) {
    return <p className="pt-1">There is nothing here, yet...</p>;
  }

  return (
    <div className="flex flex-col gap-2 text-xs">
      <p className="text-base font-bold">Items Total: {total.format}</p>
      <PopoverClose asChild>
        <Link
          className={cn(buttonVariants({ variant: 'default' }))}
          href="/checkout"
        >
          Checkout
        </Link>
      </PopoverClose>
    </div>
  );
};
