'use client';

import { useQuery } from '@apollo/client';
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

const Page = () => {
  const { data: myCartQuery, loading } = useQuery(CART_QUERY);
  const myCart = useFragment(CartFragmentFragmentDoc, myCartQuery?.myCart);
  const cartItems = myCart?.lines || [];

  return (
    <div className="w-full">
      My cart
      <div className="flex gap-4">
        <div className="flex w-3/5 flex-col gap-2">
          {cartItems.map((line) => (
            <CartItem
              key={useFragment(CartLineFragmentFragmentDoc, line).id}
              lineFragment={line}
            />
          ))}
        </div>
        <div className="flex w-2/5 flex-col">
          <Card>
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
