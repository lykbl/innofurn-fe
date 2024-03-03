import { Elements } from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import process from 'process';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@apollo/client';
import { ShippingMethods } from '@/gql/generated/graphql';
import resolveConfig from 'tailwindcss/resolveConfig';
import config from '../../../../../tailwind.config';
import CheckoutForm from '@/(storefront)/checkout/components/payment-step/checkout-form';
import { CREATE_PAYMENT_INTENT_MUTATION } from '@/gql/mutations/payment';

const PaymentStep = ({
  billingAddressId,
  shippingAddressId,
  shippingMethodId,
}: {
  billingAddressId: number;
  shippingAddressId: number;
  shippingMethodId: ShippingMethods;
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
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentStep;
