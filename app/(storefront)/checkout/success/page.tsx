'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { CAPTURE_PAYMENT_INTENT_MUTATION } from '@/gql/mutations/payment';

export default function Page() {
  const searchParams = useSearchParams();
  const [capturePaymentIntent] = useMutation(CAPTURE_PAYMENT_INTENT_MUTATION);
  useEffect(() => {
    (async () => {
      const paymentIntentId = searchParams.get('payment_intent');
      if (!paymentIntentId) {
        console.log('No payment intent client secret found');

        return;
      }

      const response = await capturePaymentIntent({
        variables: {
          input: {
            paymentIntentId: paymentIntentId,
          },
        },
      });

      if (response.errors) {
        console.error(response.errors);
      }
    })();
  }, []);

  return <div className="flex flex-col">Done! Success hooray!</div>;
}
