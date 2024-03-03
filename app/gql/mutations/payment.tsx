import { gql } from '@/gql/generated';

export const CREATE_PAYMENT_INTENT_MUTATION = gql(/* GraphQL */ `
  mutation createPaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      clientSecret
    }
  }
`);

export const CAPTURE_PAYMENT_INTENT_MUTATION = gql(/* GraphQL */ `
  mutation CapturePaymentIntent($input: CapturePaymentIntentInput!) {
    capturePaymentIntent(input: $input)
  }
`);
