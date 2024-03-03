import { gql } from '@/gql/generated';

export const ADD_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation addAddress($input: AddressInput!) {
    addAddress(input: $input) {
      ...AddressFragment
    }
  }
`);

export const EDIT_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation editAddress($input: AddressInput!) {
    editAddress(input: $input) {
      ...AddressFragment
    }
  }
`);

export const REMOVE_ADDRESS_MUTATION = gql(/* GraphQL */ `
  mutation removeAddress($id: IntID!) {
    removeAddress(id: $id)
  }
`);
