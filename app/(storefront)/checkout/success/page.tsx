'use client';

import { useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const searchParams = useSearchParams();
  useEffect(() => {
    (async () => {
      axios.defaults.withCredentials = true;
      axios.defaults.withXSRFToken = true;
      axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/capture-payment-intent`,
        {
          // paymentIntentId: searchParams.get('payment_intent_client_secret'),
          paymentIntentId: searchParams.get('payment_intent'),
        },
      );
    })();
  }, []);

  return <>Payment success!!!</>;
}
