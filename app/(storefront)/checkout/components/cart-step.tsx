import React, { Suspense } from 'react';
import { FragmentType, useFragment } from '@/gql/generated';
import { CartLineFragmentFragmentDoc } from '@/gql/generated/graphql';
import CartItem from '@/(storefront)/checkout/components/cart-item';
import { useMutation } from '@apollo/client';
import { ADD_OR_UPDATE_PURCHASABLE } from '@/gql/mutations/cart';
import { STEPS } from '@/(storefront)/checkout/page';

const CartStep = ({
  cartItemLineFragments,
  isPending,
  startTransition,
  setCurrentStep,
}: {
  cartItemLineFragments?: Array<
    FragmentType<typeof CartLineFragmentFragmentDoc>
  >;
  startTransition: React.TransitionStartFunction;
  isPending: boolean;
  setCurrentStep: (step: STEPS) => void;
}) => {
  const cartItemLines =
    cartItemLineFragments?.map((fragment) =>
      useFragment(CartLineFragmentFragmentDoc, fragment),
    ) || [];
  const [updateQuantity] = useMutation(ADD_OR_UPDATE_PURCHASABLE);
  const handleQuantityUpdate = (sku: string, quantity: number) => {
    startTransition(async () => {
      await updateQuantity({ variables: { sku, quantity } });
    });
  };

  return (
    <>
      {cartItemLines.map((line) => (
        <Suspense fallback={<div>Loading</div>} key={line.id}>
          <CartItem
            line={line}
            handleQuantityUpdate={handleQuantityUpdate}
            isUpdating={isPending}
          />
        </Suspense>
      ))}
    </>
  );
};

export default CartStep;
