import { gql } from '@/gql/generated';

export const AddAddressMutation = gql(/* GraphQL */ `
  mutation addAddress($input: AddressInput!) {
    addAddress(input: $input) {
      ...AddressFragment
    }
  }
`);

export const EditAddressMutation = gql(/* GraphQL */ `
  mutation editAddress($input: AddressInput!) {
    editAddress(input: $input) {
      ...AddressFragment
    }
  }
`);

export const RemoveAddressMutation = gql(/* GraphQL */ `
  mutation removeAddress($id: IntID!) {
    removeAddress(id: $id)
  }
`);
