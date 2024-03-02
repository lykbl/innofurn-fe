'use client';

import React, { useState } from 'react';
import { useFragment } from '@/gql/generated';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/common/card';
import {
  CartFragmentFragmentDoc,
  ShippingMethods,
} from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/common/separator';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/common/button';
import { CART_QUERY } from '@/gql/queries/cart';
import AddressStep from '@/(storefront)/checkout/components/address-step';
import PaymentStep from '@/(storefront)/checkout/components/payment-step';

export enum STEPS {
  CART,
  ADDRESS,
  PAYMENT,
  REVIEW,
}

export default function Page() {
  const { data: myCartQuery, loading: cartLoading } = useQuery(CART_QUERY);
  const myCart = useFragment(CartFragmentFragmentDoc, myCartQuery?.myCart);
  const [currentStep, setCurrentStep] = useState<STEPS>(STEPS.CART);

  return (
    <div className="w-full">
      <div className="flex gap-4">
        <div className="flex w-3/5 flex-col gap-2">
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
              <Link
                className={cn(buttonVariants({ variant: 'default' }))}
                href="/checkout"
              >
                Proceed to Checkout
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
