import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import process from 'process';
import { gql } from '@/gql/generated';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@apollo/client';
import { ShippingMethods } from '@/gql/generated/graphql';
import { Button } from '@/components/ui/common/button';
import resolveConfig from 'tailwindcss/resolveConfig';
import config from '../../../../tailwind.config';
import { STEPS } from '@/(storefront)/checkout/page';

const CREATE_PAYMENT_INTENT_MUTATION = gql(/* GraphQL */ `
  mutation createPaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      clientSecret
    }
  }
`);

const PaymentStep = ({
  billingAddressId,
  shippingAddressId,
  shippingMethodId,
  setCurrentStep,
}: {
  billingAddressId: number;
  shippingAddressId: number;
  shippingMethodId: ShippingMethods;
  setCurrentStep: (v: STEPS) => void;
}) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? ''); //TODO move to env
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT_MUTATION);
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    (async () => {
      const response = await createPaymentIntent({
        variables: {
          input: {
            billingAddressId,
            shippingAddressId,
            shippingMethodId,
          },
        },
      });
      if (!response.errors && response.data) {
        setClientSecret(response.data.createPaymentIntent.clientSecret);
      }
    })();
  }, []);

  const fullConfig = resolveConfig(config);

  const options = {
    clientSecret: clientSecret,
    appearance: {
      theme: 'stripe',
      // theme: 'flat',
      // theme: 'night',
      labels: 'floating',
      rules: {
        '.Input': {
          borderColor: '#e5e7eb',
        },
      },
    },
  } as any;

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm setCurrentStep={setCurrentStep} />
    </Elements>
  );
};

const CheckoutForm = ({
  setCurrentStep,
}: {
  setCurrentStep: (v: STEPS) => void;
}) => {
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
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/checkout/success`,
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
  };

  const handleGoBack = () => {
    setCurrentStep(STEPS.ADDRESS);
  };

  const paymentElementOptions: any = {
    layout: 'tabs',
  };

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex h-full flex-col justify-between rounded-lg border bg-white p-4"
    >
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="flex flex-col gap-2">
        <Button variant="outline" type="button" onClick={handleGoBack}>
          Back
        </Button>
        <Button type="submit">Pay now</Button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </div>
    </form>
  );
};

export default PaymentStep;
