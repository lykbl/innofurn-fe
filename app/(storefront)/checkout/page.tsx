'use client';

import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { gql, useFragment } from '@/gql/generated';
import * as process from 'process';
import { useQuery } from '@apollo/client';
import { Card, CardContent } from '@/components/ui/common/card';
import { CartFragmentFragmentDoc } from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/common/separator';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/common/button';
import { CART_QUERY } from '@/gql/queries/cart';
import AddressStep from '@/(storefront)/checkout/components/address-step';

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret',
    );

    if (!clientSecret) {
      return;
    }

    stripe
      .retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }: any) => {
        switch (paymentIntent.status) {
          case 'succeeded':
            setMessage('Payment succeeded!');
            break;
          case 'processing':
            setMessage('Your payment is processing.');
            break;
          case 'requires_payment_method':
            setMessage('Your payment was not successful, please try again.');
            break;
          default:
            setMessage('Something went wrong.');
            break;
        }
      });
  }, [stripe]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_API_HOST}:3000/checkout/success`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message);
    } else {
      setMessage('An unexpected error occurred.');
    }

    setIsLoading(false);
  };

  const paymentElementOptions: any = {
    layout: 'tabs',
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}

const CREATE_PAYMENT_INTENT_MUTATION = gql(/* GraphQL */ `
  mutation createPaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      clientSecret
    }
  }
`);

const Stripe = () => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? ''); //TODO move to env
  // const [clientSecret, setClientSecret] = useState<string>('');
  // const appearance = {
  //   theme: 'stripe',
  // };

  // useEffect(() => {
  //   (async () => {
  //     axios.defaults.withCredentials = true;
  //     axios.defaults.withXSRFToken = true;
  //     const jsonResult = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_HOST}/api/create-payment-intent`,
  //       {
  //         billingAddressId: 4,
  //         shippingAddressId: 4,
  //         shippingMethodId: 'BASDEL',
  //       },
  //     );
  //     console.log(jsonResult.data);
  //     setClientSecret(jsonResult.data.clientSecret);
  //   })();
  // }, []);

  const options = {
    clientSecret: 'abc',
    appearance: {
      theme: 'stripe',
    },
  } as any;

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default function Page() {
  const { data: myCartQuery, loading: cartLoading } = useQuery(CART_QUERY);
  const myCart = useFragment(CartFragmentFragmentDoc, myCartQuery?.myCart);
  const [addressStepFinished, setAddressStepFinished] =
    useState<boolean>(false);

  return (
    <div className="w-full">
      <h1>Checkout</h1>
      <div className="flex gap-4">
        <div className="flex w-3/5 flex-col gap-2">
          {!addressStepFinished && (
            <AddressStep setAddressStepFinished={setAddressStepFinished} />
          )}
        </div>
        <div className="flex w-2/5 flex-col">
          <Card className={cn(false && 'animate-pulse')}>
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
