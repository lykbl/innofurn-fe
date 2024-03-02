import { gql } from '@/gql/generated';

export const REMOVE_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation removeAddress($id: IntID!) {
    removeAddress(id: $id)
  }
`);
