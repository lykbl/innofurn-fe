import { PriceData } from '@/gql/scalars';
import { forwardRef } from 'react';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/common/card';
import { CartItemLine } from '@/components/ui/layout/header/cart/cart-item-line';
import {
  CartFragmentFragment,
  CartLineFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useFragment } from '@/gql/generated';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/common/button';

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
            <CartItemLine
              key={useFragment(CartLineFragmentFragmentDoc, line).id}
              lineFragment={line}
            />
          ))}
        </ul>
        <Totals
          linesCount={lines.length}
          total={total}
          taxTotal={taxTotal}
          discountTotal={discountTotal}
        />
      </CardContent>
    </Card>
  );
});

const Totals = ({
  linesCount,
  total,
  taxTotal,
  discountTotal,
}: {
  linesCount: number;
  total: PriceData;
  taxTotal: PriceData;
  discountTotal: PriceData;
}) => {
  if (linesCount === 0) {
    return <p className="pt-1">There is nothing here, yet...</p>;
  }

  return (
    <div className="flex flex-col gap-1 text-xs">
      <p>Tax Total: {taxTotal.format}</p>
      <p>Discount Total: {discountTotal.format}</p>
      <p className="text-base font-bold">Items Total: {total.format}</p>
      <Link className={cn(buttonVariants({ variant: 'default' }))} href="/cart">
        Checkout
      </Link>
    </div>
  );
};
