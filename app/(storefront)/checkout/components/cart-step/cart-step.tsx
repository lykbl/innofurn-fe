import React, { Suspense } from 'react';
import { FragmentType, useFragment } from '@/gql/generated';
import {
  CartLineFragmentFragment,
  CartLineFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import CartItem from '@/(storefront)/checkout/components/cart-step/cart-item';
import { useMutation } from '@apollo/client';
import {
  ADD_OR_UPDATE_PURCHASABLE,
  CLEAR_CART_LINE_MUTATION,
} from '@/gql/mutations/cart';

const CartStep = ({
  cartItemLineFragments,
  isPending,
  startTransition,
}: {
  cartItemLineFragments?: Array<
    FragmentType<typeof CartLineFragmentFragmentDoc>
  >;
  startTransition: React.TransitionStartFunction;
  isPending: boolean;
}) => {
  const cartItemLines =
    cartItemLineFragments?.map((fragment) =>
      useFragment(CartLineFragmentFragmentDoc, fragment),
    ) || [];
  const [updateQuantity] = useMutation(ADD_OR_UPDATE_PURCHASABLE);
  const [clearCartLine] = useMutation(CLEAR_CART_LINE_MUTATION);
  const handleQuantityUpdate = (sku: string, quantity: number) => {
    startTransition(async () => {
      await updateQuantity({ variables: { sku, quantity } });
    });
  };
  const handleClearCartItem = (sku: string) => {
    startTransition(async () => {
      await clearCartLine({
        variables: { sku },
        updateQueries: {
          cart: (prev, { mutationResult }) => {
            if (mutationResult.errors) {
              return prev;
            }

            return {
              myCart: {
                ...prev.myCart,
                lines: prev.myCart.lines.filter(
                  (line: CartLineFragmentFragment) =>
                    line.purchasable.sku !== sku,
                ),
              },
            };
          },
        },
      });
    });
  };

  return (
    <>
      {cartItemLines.map((line) => (
        <Suspense fallback={<div>Loading</div>} key={line.id}>
          <CartItem
            line={line}
            handleQuantityUpdate={handleQuantityUpdate}
            handleClearCartItem={handleClearCartItem}
            isUpdating={isPending}
          />
        </Suspense>
      ))}
    </>
  );
};

export default CartStep;
