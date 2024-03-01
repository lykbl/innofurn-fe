'use client';

import { useMutation, useQuery } from '@apollo/client';
import { CART_QUERY } from '@/gql/queries/cart';
import { useFragment } from '@/gql/generated';
import {
  CartFragmentFragmentDoc,
  CartLineFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { Card, CardContent } from '@/components/ui/common/card';
import { Separator } from '@/components/ui/common/separator';
import { Button } from '@/components/ui/common/button';
import CartItem from '@/(storefront)/cart/cart-item';
import { Suspense, useTransition } from 'react';
import { cn } from '@/lib/utils';
import { ADD_OR_UPDATE_PURCHASABLE } from '@/gql/mutations/cart';

const Page = () => {
  const { data: myCartQuery, loading } = useQuery(CART_QUERY);
  const myCart = useFragment(CartFragmentFragmentDoc, myCartQuery?.myCart);
  const cartItems = myCart?.lines || [];
  const [isPending, startTransition] = useTransition();
  const [updateQuantity] = useMutation(ADD_OR_UPDATE_PURCHASABLE);

  const handleQuantityUpdate = (sku: string, quantity: number) => {
    startTransition(async () => {
      await updateQuantity({ variables: { sku, quantity } });
    });
  };

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <div className="flex w-3/5 flex-col gap-2">
          {cartItems.map((line) => (
            <Suspense
              fallback={<div>Loading</div>}
              key={useFragment(CartLineFragmentFragmentDoc, line).id}
            >
              <CartItem
                lineFragment={line}
                handleQuantityUpdate={handleQuantityUpdate}
                isUpdating={isPending}
              />
            </Suspense>
          ))}
        </div>
        <div className="flex w-2/5 flex-col">
          <Card className={cn(isPending && 'animate-pulse')}>
            <CardContent className="flex flex-col gap-6 p-4">
              <div className="flex flex-col gap-2">
                <p className="flex justify-between">
                  <span>Items subtotal:</span>
                  <span>{myCart?.total.format}</span>
                </p>
                <p className="flex justify-between">
                  <span>Ship to</span>
                  <span>FREE</span>
                </p>
                <p className="flex justify-between">
                  <span>Tax Total:</span>
                  <span>{myCart?.taxTotal.format}</span>
                </p>
              </div>
              <Separator />
              <div>
                <div className="flex justify-between">
                  <span className="font-me">Total:</span>
                  <span>{myCart?.total.format}</span>
                </div>
                {myCart?.discountTotal.value > 0 && (
                  <div className="flex justify-between">
                    <span>You save: </span>
                    <span>{myCart?.discountTotal.format}</span>
                  </div>
                )}
              </div>
              <Button variant="default" className="w-full">
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
