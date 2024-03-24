import { gql } from '@/gql/generated';

export const CREATE_REVIEW_MUTATION = gql(/* GraphQL */ `
  mutation addAddress($input: AddressInput!) {
    addAddress(input: $input) {
      ...AddressFragment
    }
  }
`);
