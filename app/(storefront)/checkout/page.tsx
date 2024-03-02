'use client';

import React, { useState, useTransition } from 'react';
import { useFragment } from '@/gql/generated';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/common/card';
import {
  CartFragmentFragmentDoc,
  ShippingMethods,
} from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/common/separator';
import { Button } from '@/components/ui/common/button';
import { CART_QUERY } from '@/gql/queries/cart';
import AddressStep from '@/(storefront)/checkout/components/address-step/address-step';
import PaymentStep from '@/(storefront)/checkout/components/payment-step';
import CartStep from '@/(storefront)/checkout/components/cart-step/cart-step';

export enum STEPS {
  CART,
  ADDRESS,
  PAYMENT,
  REVIEW,
}

export default function Page() {
  const { data: myCartQuery, loading: cartLoading } = useQuery(CART_QUERY, {
    fetchPolicy: 'cache-and-network',
  });
  const myCart = useFragment(CartFragmentFragmentDoc, myCartQuery?.myCart);
  const cartItemLineFragments = myCart?.lines || [];
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.CART);

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => {
      if (prevStep === STEPS.CART) {
        return prevStep;
      }

      return prevStep - 1;
    });
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => {
      if (prevStep === STEPS.REVIEW) {
        return prevStep;
      }

      return prevStep + 1;
    });
  };

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <div className="flex w-3/5 flex-col gap-2">
          {currentStep === STEPS.CART && (
            <CartStep
              cartItemLineFragments={cartItemLineFragments}
              startTransition={startTransition}
              isPending={isPending}
            />
          )}
          {currentStep === STEPS.ADDRESS && (
            <AddressStep setCurrentStep={setCurrentStep} />
          )}
          {currentStep === STEPS.PAYMENT && (
            <PaymentStep
              shippingAddressId={31}
              billingAddressId={31}
              shippingMethodId={ShippingMethods.BASDEL}
              setCurrentStep={setCurrentStep}
            />
          )}
        </div>
        <div className="flex w-2/5 flex-col">
          <Card className={cn(false && 'animate-pulse')}>
            <CardContent className="flex min-h-80 flex-col justify-between gap-6 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 rounded-lg border bg-white p-2">
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
                <Separator className="bg-primary" />
                <div>
                  <div className="flex justify-between">
                    <span className="font-me">Total:</span>
                    <span>{myCart?.total.format}</span>
                  </div>
                  <div
                    className={cn(
                      'flex justify-between opacity-0',
                      myCart?.discountTotal.value > 0 && 'opacity-100',
                    )}
                  >
                    <span>You save: </span>
                    <span>{myCart?.discountTotal.format}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  className={cn(
                    'opacity-100 transition-opacity duration-300',
                    currentStep === STEPS.CART &&
                      'pointer-events-none opacity-0',
                  )}
                >
                  Back
                </Button>
                <Button variant="default" onClick={handleNextStep}>
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
